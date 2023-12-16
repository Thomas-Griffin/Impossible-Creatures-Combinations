import { readFileSync } from 'fs'
import MongoService from './mongoService'
import Joi from 'joi'
import { InternalServerError } from '../errors/genericErrors'
import Mod from '../types/Mod'

let mods: Mod[] = JSON.parse(readFileSync('services/schema.json', 'utf8'))
const testMods: Mod[] = JSON.parse(readFileSync('services/testSchema.json', 'utf8'))
mods = mods.concat(testMods)

class VisualisationsService extends MongoService {
  modSchema: Joi.ObjectSchema

  constructor() {
    super()
    this.modSchema = Joi.object({
      mod: Joi.object({
        name: Joi.string()
          .valid(...mods.map(mod => mod.name))
          .required(),
        version: Joi.string()
          .valid(...mods.map(mod => mod.version))
          .required(),
        columns: Joi.array().items(Joi.object()).optional(),
      }),
    })
  }

  toCollectionName(mod: Mod) {
    return `${mod?.name} ${mod?.version}`
  }

  sortObjectKeys<T extends Record<string, any>>(obj: T): T {
    const sortedKeys: string[] = Object.keys(obj).sort()
    const sortedObject: Partial<Record<string, any>> = {}
    for (const key of sortedKeys) {
      sortedObject[key] = obj[key]
    }
    return sortedObject as T
  }

  formatResearchLevels(document: { counts: Record<string, number> }) {
    if (document.counts) {
      if (document.counts['Research Level 1'] === undefined) {
        document.counts['Research Level 1'] = 0
      }
      if (document.counts['Research Level 2'] === undefined) {
        document.counts['Research Level 2'] = 0
      }
      if (document.counts['Research Level 3'] === undefined) {
        document.counts['Research Level 3'] = 0
      }
      if (document.counts['Research Level 4'] === undefined) {
        document.counts['Research Level 4'] = 0
      }
      if (document.counts['Research Level 5'] === undefined) {
        document.counts['Research Level 5'] = 0
      }
      document.counts = this.sortObjectKeys(document.counts)
    }
    return document
  }

  async getResearchLevelsPerStock(body: { mod: Mod }) {
    const { error } = this.modSchema.validate(body)
    if (error) {
      return error
    } else {
      await this.client.connect()
      try {
        const result = await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .aggregate([
            {
              $project: {
                'Research Level': 1,
                Animals: ['$Animal 1', '$Animal 2'],
              },
            },
            {
              $unwind: '$Animals',
            },
            {
              $group: {
                _id: {
                  Animal: '$Animals',
                  ResearchLevel: {
                    $cond: [{ $eq: ['$Research Level', null] }, 'Unknown', { $toString: '$Research Level' }],
                  },
                },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                animal: '$_id.Animal',
                researchLevel: { $concat: ['Research Level ', '$_id.ResearchLevel'] },
                count: '$count',
              },
            },
            {
              $group: {
                _id: '$animal',
                counts: {
                  $push: {
                    k: '$researchLevel',
                    v: '$count',
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                animal: '$_id',
                counts: { $arrayToObject: '$counts' },
              },
            },
            {
              $sort: { animal: 1 },
            },
          ])
          .toArray()
        result.forEach((document: any) => this.formatResearchLevels(document))
        return result
      } catch (err) {
        console.error(err)
        return InternalServerError
      }
    }
  }

  async getCoalCostDistribution(body: { mod: Mod }) {
    const { error } = this.modSchema.validate(body)
    if (error) {
      return error
    } else {
      await this.client.connect()
      try {
        return await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .aggregate([
            {
              $match: {
                Coal: { $ne: null },
              },
            },
            {
              $bucket: {
                groupBy: '$Coal',
                boundaries: Array.from({ length: 21 }, (_, i) => i * 100),
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                  lowerBound: { $min: '$Coal' },
                  upperBound: { $max: '$Coal' },
                },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                bounds: {
                  lower: '$lowerBound',
                  upper: '$upperBound',
                },
              },
            },
          ])
          .toArray()
      } catch (err) {
        console.error(err)
        return InternalServerError
      }
    }
  }

  async getCoalCostDistributionPerResearchLevel(body: { mod: Mod }) {
    const { error } = this.modSchema.validate(body)
    if (error) {
      return error
    } else {
      await this.client.connect()
      try {
        let result = await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .aggregate([
            {
              $addFields: {
                coalInterval: {
                  $floor: { $divide: ['$Coal', 100] },
                },
              },
            },
            {
              $group: {
                _id: {
                  ResearchLevel: '$Research Level',
                  CoalInterval: '$coalInterval',
                },
                count: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: '$_id.CoalInterval',
                counts: {
                  $push: {
                    k: { $concat: ['Research Level ', { $toString: '$_id.ResearchLevel' }] },
                    v: '$count',
                  },
                },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $project: {
                _id: 0,
                bounds: {
                  lower: { $multiply: ['$_id', 100] },
                  upper: { $add: [{ $multiply: ['$_id', 100] }, 100] },
                },
                counts: { $arrayToObject: '$counts' },
              },
            },
          ])
          .toArray()

        result.forEach((document: any) => this.formatResearchLevels(document))

        return result
      } catch (err) {
        console.error(err)
        return InternalServerError
      }
    }
  }

  async getElectricityDistribution(body: { mod: Mod }) {
    const { error } = this.modSchema.validate(body)
    if (error) {
      return error
    } else {
      await this.client.connect()
      try {
        return await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .aggregate([
            {
              $bucket: {
                groupBy: '$Electricity',
                boundaries: Array.from({ length: 21 }, (_, i) => i * 100),
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                  lowerBound: { $min: '$Electricity' },
                  upperBound: { $max: '$Electricity' },
                },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                bounds: {
                  lower: '$lowerBound',
                  upper: '$upperBound',
                },
              },
            },
          ])
          .toArray()
      } catch (err) {
        console.error(err)
        return InternalServerError
      }
    }
  }

  async getElectricityDistributionPerResearchLevel(body: { mod: Mod }) {
    const { error } = this.modSchema.validate(body)
    if (error) {
      return error
    } else {
      await this.client.connect()
      try {
        let result = await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .aggregate([
            {
              $addFields: {
                electricityInterval: {
                  $floor: { $divide: ['$Electricity', 100] },
                },
              },
            },
            {
              $group: {
                _id: {
                  ResearchLevel: '$Research Level',
                  ElectricityInterval: '$electricityInterval',
                },
                count: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: '$_id.ElectricityInterval',
                counts: {
                  $push: {
                    k: { $concat: ['Research Level ', { $toString: '$_id.ResearchLevel' }] },
                    v: '$count',
                  },
                },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $project: {
                _id: 0,
                bounds: {
                  lower: { $multiply: ['$_id', 100] },
                  upper: { $add: [{ $multiply: ['$_id', 100] }, 100] },
                },
                counts: { $arrayToObject: '$counts' },
              },
            },
          ])
          .toArray()

        result.forEach((document: any) => this.formatResearchLevels(document))

        return result
      } catch (err) {
        console.error(err)
        return InternalServerError
      }
    }
  }
}

export default VisualisationsService
