import DatabaseService from '../../services/databaseService'

import {
  modCombinationTotals,
  testMod,
  testModName,
  testModSchema,
  testModsCollectionName,
  testProcessedCombinations,
  testUnprocessedCombinations,
  totalNumberOfMods,
} from '../constants/globalTestConstants'
import { CollectionInfo } from 'mongodb'
import { MOD_COLLECTION_NAME, MOD_DIRECTORY, MOD_DIRECTORY_NAME } from '../../globalConstants'
import * as process from 'process'

import fs from 'fs'

let databaseService = new DatabaseService()
describe('Database service tests', () => {
  beforeEach(async () => {
    await databaseService.client.connect()
    return databaseService.client
      .db(process.env['MONGO_DB_NAME'])
      .dropDatabase()
      .finally(() => databaseService.client.close())
  })

  afterEach(async () => {
    await databaseService.client.connect()
    if (fs.existsSync(MOD_DIRECTORY)) {
      fs.rmSync(MOD_DIRECTORY, { recursive: true })
    }
    return databaseService.client
      .db(process.env['MONGO_DB_NAME'])
      .dropDatabase()
      .finally(() => databaseService.client.close())
  })

  afterAll(async () => {
    await databaseService.client.connect()
    return databaseService.client
      .db(process.env['MONGO_DB_NAME'])
      .dropDatabase()
      .finally(() => databaseService.client.close())
  })

  describe('create database', () => {
    it('should create the correct database', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      // must insert at least one item for collection to show up in list
      await databaseService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).insertOne(testMod)
      const databaseNames = (await databaseService.client.db('admin').admin().listDatabases()).databases.map(
        database => database.name
      )
      expect(databaseNames).toContain(process.env['MONGO_DB_NAME'])
    })
    it('should create an empty database', async () => {
      await databaseService.createDatabase()
      const collections = await databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections().toArray()
      expect(collections).toEqual([])
    })
  })
  describe('create mods collection', () => {
    it('should create only the mods collection', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      const collections = databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections()
      const collectionNames = (await collections.toArray()).map((collection: CollectionInfo) => collection.name)
      expect(collectionNames).toHaveLength(1)
      expect(collectionNames).toContain(MOD_COLLECTION_NAME)
    })
  })
  describe('create mod collections', () => {
    it('should create every required mod collection', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModCollections()
      const db = databaseService.client.db(process.env['MONGO_DB_NAME'])
      const collections = db.listCollections()
      const collectionsResult = await collections.toArray()
      const collectionNames = collectionsResult.map((collection: CollectionInfo) => collection.name)
      expect(collectionNames).toHaveLength(totalNumberOfMods)
    })
  })
  describe('populate mod collection with mod data', () => {
    it('should have the same number of mods in the mod collection as the total number of mods', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      const mods = await databaseService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(testModsCollectionName)
        .find()
        .project({ _id: 0 })
        .toArray()
      expect(mods).toHaveLength(totalNumberOfMods)
    })
  })
  describe('populate mod collection with combinations', () => {
    it('should insert the correct number of combinations for each mod', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      await databaseService.createModCollections()
      await databaseService.populateModCollectionWithCombinations(testModSchema, testUnprocessedCombinations)
      expect(
        await databaseService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).find().toArray()
      ).toHaveLength(testUnprocessedCombinations.length)
    })
    it('should populate with combinations that match the desired output', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      await databaseService.createModCollections()
      await databaseService.populateModCollectionWithCombinations(testModSchema, testUnprocessedCombinations)
      const combinations = await databaseService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(testModName)
        .find()
        .project({ _id: 0 })
        .toArray()
      expect(combinations).toEqual(testProcessedCombinations)
    })
  })
  describe('get property value', () => {
    it('should return the correct value for armour', async () => {
      await databaseService.client.connect()

      const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[0], [
        'attributes',
        'armour',
        1,
      ])
      expect(propertyValue).toEqual(0.3999999761581421)
    })
    it('should return the correct value for composition', async () => {
      await databaseService.client.connect()
      const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[2], ['composition', 4])
      expect(propertyValue).toEqual(2)
    })
  })
  describe('database exists', () => {
    it('should return true if the database exists', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
      expect(result).toEqual(true)
    })
    it('should return false if the database does not exist', async () => {
      await databaseService.client.connect()
      const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
      expect(result).toEqual(false)
    })
  })
  describe('deleteDatabase', () => {
    it('should delete the database', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.deleteDatabase()
      const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
      expect(result).toEqual(false)
    })
  })
  describe('createModDirectories', () => {
    it('should create the mod directories', async () => {
      databaseService.createModDirectories()
      const modDirectories = fs.readdirSync(MOD_DIRECTORY_NAME)
      expect(modDirectories).toHaveLength(totalNumberOfMods)
      fs.rmdirSync(MOD_DIRECTORY_NAME)
    })
  })
  describe('createModFile', () => {
    it('should create the mod file', async () => {
      databaseService.createModFile({ name: 'Impossible Creatures', version: '1.1' })
      const modFile = fs.readFileSync(`${MOD_DIRECTORY_NAME}/Impossible Creatures/1.1/combinations.json`, 'utf8')
      expect(modFile).toHaveLength(
        modCombinationTotals.find(mod => mod.name === 'Impossible Creatures' && mod.version === '1.1')!.total
      )
    })
  })
  describe('fetchUnprocessedCombinations', () => {
    it('should return the correct number of combinations', async () => {
      const unprocessedCombinations = await databaseService.fetchUnprocessedCombinations({
        name: 'Impossible Creatures',
        version: '1.1',
      })
      expect(unprocessedCombinations).toHaveLength(
        modCombinationTotals.find(mod => mod.name === 'Impossible Creatures' && mod.version === '1.1')!.total
      )
    })
  })
  describe('loadCombinations', () => {
    it('should return the correct number of combinations', async () => {
      const combinations = await databaseService.loadCombinations({ name: 'Impossible Creatures', version: '1.1' })
      expect(combinations).toHaveLength(
        modCombinationTotals.find(mod => mod.name === 'Impossible Creatures' && mod.version === '1.1')!.total
      )
    })
  })
  describe('populateModCollectionsWithCombinations', () => {
    it('should populate the mod collections with the correct number of combinations', async () => {
      await databaseService.client.connect()
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      await databaseService.createModCollections()
      await databaseService.populateModCollectionsWithCombinations()
      for (const mod of modCombinationTotals) {
        expect(
          await databaseService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(`${mod.name} ${mod.version}`)
            .find()
            .toArray()
        ).toHaveLength(mod.total)
      }
    })
  })
  describe('deleteModDirectories', () => {
    it('should delete the mod directories', async () => {
      databaseService.createModDirectories()
      databaseService.deleteModDirectories()
      const modDirectories = fs.existsSync(MOD_DIRECTORY)
      expect(modDirectories).toEqual(false)
    })
  })
  describe('initialise', () => {
    it('should initialise the database', async () => {
      await databaseService.initialise()
      const modDirectories = fs.readdirSync(MOD_DIRECTORY)
      expect(modDirectories).toHaveLength(totalNumberOfMods)
      fs.rmdirSync(MOD_DIRECTORY_NAME)
      const collections = await databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections().toArray()
      const collectionNames = collections.map((collection: CollectionInfo) => collection.name)
      expect(collectionNames).toHaveLength(totalNumberOfMods)
    })
  })
  describe('acquireMissingJSONCombinationFiles', () => {
    it('should acquire the missing JSON combination files', async () => {
      await databaseService.acquireMissingJSONCombinationFiles()
      const modDirectories = fs.readdirSync(MOD_DIRECTORY)
      expect(modDirectories).toHaveLength(totalNumberOfMods)
      fs.rmdirSync(MOD_DIRECTORY)
    })
  })

  describe('resetDatabase', () => {
    it('should reset the database', async () => {
      await databaseService.resetDatabase()
      const modDirectories = fs.existsSync(MOD_DIRECTORY)
      expect(modDirectories).toEqual(false)
      const collections = await databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections().toArray()
      const collectionNames = collections.map((collection: CollectionInfo) => collection.name)
      expect(collectionNames).toHaveLength(totalNumberOfMods + 1)
      expect(collectionNames).toContain(MOD_COLLECTION_NAME)
    })
  })
})
