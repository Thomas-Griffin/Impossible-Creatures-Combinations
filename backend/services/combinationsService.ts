import MongoService from './mongoService'
import combinationErrors from '../errors/combinationsErrors'
import genericErrors from '../errors/genericErrors'
import { readFileSync } from 'fs'
import Mod from '../types/Mod'
import SortingType from '../types/SortingType'
import Joi from 'joi'

let mods = JSON.parse(readFileSync('services/schema.json', 'utf8'))
const testMods = JSON.parse(readFileSync('services/testSchema.json', 'utf8'))
mods = mods.concat(testMods)

class CombinationsService extends MongoService {
  constructor() {
    super()
  }

  async getTotalCombinations(body: {
    mod?: Mod
    filters?: object
    sorting?: {
      column?: string
      order?: SortingType
    }
  }) {
    const bodySchema = Joi.object({
      mod: Joi.object({
        name: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.name))
          .required(),
        version: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.version))
          .required(),
        columns: Joi.array().items(Joi.object()).optional(),
      }),
      filters: Joi.object().optional(),
      sorting: Joi.object({
        column: Joi.string().optional(),
        order: Joi.string().valid('ascending', 'descending').optional().messages({
          'any.only': 'The "order" field must be either "ascending" or "descending"',
        }),
      })
        .optional()
        .messages({
          'object.base': 'The "sorting" field must be an object',
        }),
    })
    const { error } = bodySchema.validate(body, { abortEarly: false })
    if (error) {
      return error
    }
    const mod = body?.mod
    if (mod === null || mod === undefined) {
      return combinationErrors.ModMissingError
    }
    if (mod?.name === null || mod?.name === undefined) {
      return combinationErrors.ModNameError
    }
    if (mod?.version === null || mod?.version === undefined) {
      return combinationErrors.ModVersionError
    } else if (mod.name && mod.version) {
      await this.client.connect()
      try {
        const query = this.buildFiltersQuery(body)
        return await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(mod))
          .countDocuments(query)
      } catch (err) {
        console.error(err)
        return genericErrors.InternalServerError
      }
    }
    return genericErrors.InternalServerError
  }

  async getCombinations(
    body: {
      mod: Mod
      sorting?: {
        column?: string
        order?: SortingType
      }
      filters?: object
    },
    pageNumber: number,
    nPerPage: number
  ) {
    const bodySchema = Joi.object({
      mod: Joi.object({
        name: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.name))
          .required(),
        version: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.version))
          .required(),
        columns: Joi.array().items(Joi.object()).optional(),
      }),
      filters: Joi.object().optional(),
      sorting: Joi.object({
        column: Joi.string().optional(),
        order: Joi.string().valid('ascending', 'descending').optional().messages({
          'any.only': 'The "order" field must be either "ascending" or "descending"',
        }),
      })
        .optional()
        .messages({
          'object.base': 'The "sorting" field must be an object',
        }),
    })
    const { error } = bodySchema.validate(body, { abortEarly: false })
    if (error) {
      return error
    }
    const pageNumberSchema = Joi.number().strict().integer().min(1).required().label('pageNumber')
    const { error: pageNumberError } = pageNumberSchema.validate(pageNumber)
    if (pageNumberError) {
      return pageNumberError
    }
    const nPerPageSchema = Joi.number().strict().integer().min(1).required().label('nPerPage')
    const { error: nPerPageError } = nPerPageSchema.validate(nPerPage)
    if (nPerPageError) {
      return nPerPageError
    }
    if (body?.mod?.name && body?.mod?.version) {
      try {
        await this.client.connect()
        const query = this.buildFiltersQuery(body)
        return await this.client
          .db(process.env['MONGO_DB_NAME'])
          .collection(this.toCollectionName(body.mod))
          .find(query)
          .sort({ [body?.sorting?.column ?? 'Animal 1']: body?.sorting?.order === SortingType.Descending ? -1 : 1 })
          .skip((pageNumber - 1) * nPerPage)
          .limit(nPerPage)
          .toArray()
      } catch (err) {
        console.error(err)
        return { status: 500, body: err }
      }
    }
    return genericErrors.InternalServerError
  }

  async getAttributeMinMax(body: { mod?: Mod; attribute?: string | any }) {
    const bodySchema = Joi.object({
      mod: Joi.object({
        name: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.name))
          .required(),
        version: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.version))
          .required(),
        columns: Joi.array().items(Joi.object()).optional(),
      }).required(),
      attribute: Joi.string().required(),
    })

    const { error } = bodySchema.validate(body, { abortEarly: false })
    if (error) {
      return error
    }
    try {
      await this.client.connect()
      let minMax = await this.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(this.toCollectionName(body.mod))
        .aggregate([
          {
            $group: {
              _id: null,
              min: { $min: `$${body.attribute}` },
              max: { $max: `$${body.attribute}` },
            },
          },
        ])
        .project({ _id: 0 })
        .toArray()
      return minMax[0]
    } catch (err) {
      console.error(err)
    }
    return genericErrors.InternalServerError
  }

  async getAbilities(body: { mod: Mod }) {
    const bodySchema = Joi.object({
      mod: Joi.object({
        name: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.name))
          .required(),
        version: Joi.string()
          .valid(...mods.map((mod: Mod) => mod.version))
          .required(),
        columns: Joi.array().items(Joi.object()).optional(),
      }).required(),
    })

    const { error } = bodySchema.validate(body, { abortEarly: false })
    if (error) {
      return error
    }
    try {
      await this.client.connect()
      let abilities = await this.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(this.toCollectionName(body.mod))
        .aggregate([
          { $unwind: '$Abilities' },
          { $group: { _id: '$Abilities.ability' } },
          { $project: { _id: 0, ability: '$_id' } },
        ])
        .toArray()
      return abilities.flatMap(ability => ability['ability'])
    } catch (err) {
      console.error(err)
    }
    return genericErrors.InternalServerError
  }

  toCollectionName(mod: Mod | undefined) {
    if (mod === null || mod === undefined) {
      return ''
    }
    return `${mod.name} ${mod.version}`
  }

  buildFiltersQuery(body: {
    mod?: Mod
    sorting?: {
      column?: string
      order?: SortingType
    }
    filters?: object
  }) {
    const defaultSorting = { column: 'Animal 1', order: SortingType.Descending }
    if (body === null) {
      body = {
        mod: mods[0],
        filters: [],
        sorting: defaultSorting,
      }
    }
    if (body?.filters === null || body?.filters === undefined) {
      body.filters = {}
    }
    if (body?.sorting === null || body?.sorting === undefined) {
      body.sorting = defaultSorting
    }
    let query: any = {}
    Object.values(body.filters).forEach(obj => {
      if (obj !== null && obj.filter !== null) {
        if (
          obj.filter.min !== null &&
          obj.filter.max !== null &&
          obj.filter.min !== undefined &&
          obj.filter.max !== undefined
        )
          query[obj.label] = {
            $gte: obj.filter.min,
            $lte: obj.filter.max,
          }
        else if (obj.label === 'Abilities') {
          query['Abilities.ability'] = { $all: obj.filter }
        } else {
          query[obj.label] = { $regex: new RegExp(obj.filter, 'i') }
        }
      }
    })
    return query
  }
}

export default CombinationsService
