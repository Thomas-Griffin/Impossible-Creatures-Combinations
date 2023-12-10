import { access, constants, existsSync, mkdir, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import MongoService from './mongoService'
import Mod from '../types/Mod'
import Combination from '../types/Combination'
import ProcessedCombination from '../types/ProcessedCombination'
import { ModSchema } from '../types/ModSchema'
import Ability from '../types/Ability'

import {
  ABILITIES_FILE_PATH,
  COMBINATIONS_DIRECTORY,
  MOD_COLLECTION_NAME,
  MOD_DIRECTORY_NAME,
  SCHEMA_FILE_PATH,
} from '../globalConstants'

const abilitiesMap: Record<string, string> = JSON.parse(readFileSync(ABILITIES_FILE_PATH, 'utf8'))

class DatabaseService extends MongoService {
  schema: ModSchema[] = []

  constructor() {
    super()
    this.getSchema()
  }

  async createDatabase() {
    try {
      await this.client.connect()
      this.client.db(process.env['MONGO_DB_NAME'])
      console.log(`Database '${process.env['MONGO_DB_NAME']}' was created.`)
    } catch (err) {
      console.error(err)
    }
  }

  async createModsCollection() {
    try {
      await this.client.connect()
      await this.client.db(process.env['MONGO_DB_NAME']).createCollection(MOD_COLLECTION_NAME)
      console.log(`Mod collection '${MOD_COLLECTION_NAME}' was created.`)
    } catch (err) {
      console.error(err)
    }
  }

  async createModCollections() {
    try {
      await this.client.connect()
      for (const mod of this.schema) {
        await this.client.db(process.env['MONGO_DB_NAME']).createCollection(`${mod.name} ${mod.version}`)
        console.log(`Mod collection '${mod.name} ${mod.version}' was created.`)
      }
      console.log(`All mod collections were created.`)
    } catch (err) {
      console.error(err)
    }
  }

  async databaseExists(databaseName: string | undefined) {
    if (databaseName === undefined) {
      return false
    }
    try {
      await this.client.connect()
      const adminDb = this.client.db('admin')
      const result = await adminDb.admin().listDatabases()
      const databases = result.databases.map(db => db.name)
      return databases.includes(databaseName)
    } finally {
      await this.client.close()
    }
  }

  async deleteDatabase() {
    console.log(`Deleting database '${process.env['MONGO_DB_NAME']}'...`)
    try {
      await this.client.connect()
      if (await this.databaseExists(process.env['MONGO_DB_NAME'] ?? '')) {
        await this.client.connect()
        await this.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        console.log(`All collections and indexes in ${process.env['MONGO_DB_NAME']} database have been deleted.`)
      } else {
        console.log(`Database '${process.env['MONGO_DB_NAME']}' does not exist.`)
      }
    } catch (error) {
      console.error('Error deleting database contents', error)
    }
  }

  getSchema() {
    this.schema = JSON.parse(readFileSync(SCHEMA_FILE_PATH).toString())
  }

  createModDirectories() {
    for (const mod of this.schema) {
      mkdir(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}`, { recursive: true }, err => {
        if (err) throw err
      })
      this.createModFile(mod)
    }
  }

  createModFile(mod: Mod) {
    let combinations = JSON.stringify(this.fetchUnprocessedCombinations(mod))
    if (existsSync(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`)) {
      access(
        `${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`,
        constants.R_OK | constants.W_OK,
        err => {
          if (err) {
            console.error(`no access to mod file: ${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`)
          } else {
            writeFileSync(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`, combinations)
          }
        }
      )
    } else {
      mkdirSync(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}`, { recursive: true })
      writeFileSync(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`, combinations)
    }
  }

  fetchUnprocessedCombinations(mod: Mod) {
    console.log('fetching all combinations for mod: ' + mod.name + ' ' + mod.version)
    try {
      return JSON.parse(readFileSync(`${COMBINATIONS_DIRECTORY}/${mod.name} ${mod.version}.json`, 'utf8'))
    } catch (err) {
      console.error(err)
    }
  }

  loadCombinations(mod: Mod) {
    return JSON.parse(readFileSync(`${MOD_DIRECTORY_NAME}/${mod.name}/${mod.version}/combinations.json`, 'utf8'))
  }

  getPropertyValue(combination: Combination | undefined, path: any[]): string | number | undefined {
    return path.reduce((obj, prop) => obj && obj[prop], combination)
  }

  getAnimalNameLimbBelongsTo(combination: Combination, limbIndex: number) {
    if (limbIndex === 1) {
      return this.snakeCaseToTitleCase(combination['stock_1'])
    } else if (limbIndex === 2) {
      return this.snakeCaseToTitleCase(combination['stock_2'])
    } else if (limbIndex === -1) {
      return 'Inherent'
    } else return 'None'
  }

  async populateModCollectionWithCombinations(modSchema: ModSchema, combinations: Combination[] | null = null) {
    combinations = combinations ?? this.loadCombinations(modSchema)
    if (combinations === null) {
      console.error('No combinations were found for mod: ' + modSchema.name + ' ' + modSchema.version)
      return
    }
    let totalProcessed = 0
    for (const combination of combinations) {
      let processedCombination: ProcessedCombination = {}
      let propertyValue
      modSchema.columns.forEach(column => {
        if (column?.path !== undefined) {
          propertyValue = this.getPropertyValue(combination, column.path)
          if (column.type === 'string' && column.format === true) {
            if (column.path.includes('composition')) {
              propertyValue = this.getAnimalNameLimbBelongsTo(combination, propertyValue as number)
            }
            propertyValue = this.snakeCaseToTitleCase(propertyValue as string)
          } else if (column.type === 'float' && column?.decimal_places !== undefined) {
            if (propertyValue === undefined) {
              propertyValue = 0
            } else {
              propertyValue = this.roundToDecimal(propertyValue as number, column?.decimal_places)
            }
          } else if (column.type === 'percentage' && column?.decimal_places !== undefined) {
            if (propertyValue === undefined) {
              propertyValue = 0
            } else {
              propertyValue = this.roundToDecimal((propertyValue as number) * 100, column.decimal_places)
            }
          }
          // @ts-ignore
          processedCombination[column.label] = propertyValue
        }
      })
      if (processedCombination?.EHP === null || processedCombination?.EHP === undefined) {
        processedCombination.EHP = this.calculateEHP(processedCombination)
      }

      processedCombination.SDT = this.calculateSelfDestructionTime(processedCombination)

      processedCombination.Abilities = this.getAbilities(combination)

      await this.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(`${modSchema.name} ${modSchema.version}`)
        .insertOne(processedCombination)
      totalProcessed += 1
    }
    console.log(`Collection '${modSchema.name} ${modSchema.version}' was populated with ${totalProcessed} documents.`)
  }

  getBodyPart(index: number): string {
    if (index - 2 < 0) {
      return 'Innate'
    }
    switch (index) {
      case 0:
        return 'Front Legs'
      case 1:
        return 'Rear Legs'
      case 2:
        return 'Head'
      case 3:
        return 'Tail'
      case 4:
        return 'Torso'
      case 5:
        return 'Pincers'
      case 6:
        return 'Wings'
      default:
        return 'None'
    }
  }

  getAbilities(combination: Combination): Ability[] {
    let abilities = Object.entries(abilitiesMap).map(entry => {
      let ability = entry[0]
      let label = entry[1]
      let limbIndex = combination.attributes[ability]?.[0]
      if (limbIndex === undefined) {
        return undefined
      } else
        return {
          ability: label,
          source: this.getBodyPart(limbIndex),
        }
    })
    return abilities.filter(ability => ability !== undefined) as Ability[]
  }

  calculateEHP(combination: ProcessedCombination) {
    if (combination?.Health && combination?.Defence) {
      return this.roundToDecimal(combination.Health / (1 - combination.Defence / 100), 1)
    } else return -1
  }

  calculateSelfDestructionTime(processedCombination: ProcessedCombination) {
    if (processedCombination?.['Melee Damage'] === undefined || processedCombination?.EHP === undefined) {
      return -1
    }
    return this.roundToDecimal(processedCombination.EHP / processedCombination['Melee Damage'], 1)
  }

  snakeCaseToTitleCase(property: string) {
    return property.replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase())
  }

  roundToDecimal(num: number, decimalPlaces: number = 1): number {
    const factor = 10 ** decimalPlaces
    const roundedNum = Math.round(num * factor) / factor
    if (Math.trunc(roundedNum) === roundedNum) {
      return roundedNum
    } else {
      return parseFloat(roundedNum.toFixed(decimalPlaces))
    }
  }

  async populateModCollectionWithModData() {
    for (const mod of this.schema) {
      console.log(`populating collection for mod: ${mod.name} ${mod.version} with mod data`)
      let modData = {
        name: mod.name,
        version: mod.version,
        columns: mod.columns.map((column: { label: any; type: any }) => {
          return { label: column.label, type: column.type }
        }),
      }
      await this.client.db(process.env['MONGO_DB_NAME']).collection(MOD_COLLECTION_NAME).insertOne(modData)
    }
  }

  async populateModCollectionsWithCombinations() {
    for (const mod of this.schema) {
      console.log(`populating collection for mod: ${mod.name} ${mod.version} with combinations`)
      await this.populateModCollectionWithCombinations(mod)
    }
  }

  deleteModDirectories() {
    if (existsSync(`${MOD_DIRECTORY_NAME}`)) {
      rmSync(`${MOD_DIRECTORY_NAME}`, { recursive: true })
    }
  }

  async initialise() {
    await this.acquireMissingJSONCombinationFiles()
    this.createModDirectories()
    await this.createDatabase()
    await this.createModsCollection()
    await this.createModCollections()
    await this.populateModCollectionWithModData()
    await this.populateModCollectionsWithCombinations()
    this.deleteModDirectories()
  }

  async acquireMissingJSONCombinationFiles() {
    let jsonFilesExist = true
    for (const mod of this.schema) {
      if (!existsSync(`${COMBINATIONS_DIRECTORY}/${mod.name} ${mod.version}.json`)) {
        jsonFilesExist = false
      }
    }
    if (!jsonFilesExist) {
      console.log(`Combinations files are missing.`)
      console.log('Running cleanup script...')
      import(`${COMBINATIONS_DIRECTORY}/cleanup`)
        .then(module => {
          module.default
        })
        .catch(err => console.error(err))
      console.log('Extracting combinations from compressed files...')
      import(`${COMBINATIONS_DIRECTORY}/decompressor`)
        .then(module => {
          module.default
        })
        .catch(err => console.error(err))
    }
  }

  async resetDatabase() {
    console.log(`Resetting database '${process.env['MONGO_DB_NAME']}'...`)
    if (existsSync(`../${MOD_DIRECTORY_NAME}`)) {
      console.log(`Directory '${MOD_DIRECTORY_NAME}' exists.`)
      console.log(`Deleting directory '${MOD_DIRECTORY_NAME}'...`)
      rmSync(`../${MOD_DIRECTORY_NAME}`, { recursive: true })
    }
    try {
      await this.deleteDatabase()
      await this.initialise().then(() => {
        return { message: 'The Database was reset.' }
      })
    } catch (err) {
      console.error(err)
      return { message: 'The Database could not be reset.', error: err }
    }
    return { message: 'The Database could not be reset.' }
  }
}

export default DatabaseService
