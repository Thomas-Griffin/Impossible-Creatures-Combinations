import MongoService from '@backend/services/mongoService'
import Joi from 'joi'

import type {Filter, MongoClient, SortDirection, WithId} from 'mongodb'
import logger from '@backend/utility/logger'

import type {DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData} from 'primevue/datatable'
import {COMBINATIONS_COLLECTION_NAME, DEFAULT_MOD, JOI_MOD_SCHEMA} from '@src/globals'
import CombinationFilterQuery from '~types/CombinationFilterQuery'
import CombinationQueryFilterOperators from '~types/CombinationQueryFilterOperators'
import CombinationAttributeNames from '~types/CombinationAttributeNames'
import MinMaxRequestBody from '~types/MinMaxRequestBody'
import Combination from '~types/Combination'
import SortingType from '~types/SortingType'
import CombinationsRequestBody from '~types/CombinationsRequestBody'
import Mod from '~types/Mod'
import CombinationAbilities from '~types/CombinationAbilities'
import {escapeRegExp} from 'lodash'

class CombinationsService {
    combinationRequestSchema: Joi.ObjectSchema
    minMaxSchema: Joi.ObjectSchema
    abilitiesRequestSchema: Joi.ObjectSchema
    client: MongoClient

    constructor() {
        this.client = new MongoService().client
        this.combinationRequestSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
            filters: Joi.object().optional(),
            sorting: Joi.object({
                column: Joi.string().optional(),
                order: Joi.string()
                    .valid(...Object.values(SortingType))
                    .optional(),
            }).optional(),
            page: Joi.number().strict().integer().min(1).required(),
            perPage: Joi.number().strict().integer().min(1).required(),
        })

        this.minMaxSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
            attribute: Joi.string().required(),
        })

        this.abilitiesRequestSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
        })
    }

    async getTotalCombinations(body: CombinationsRequestBody): Promise<number> {
        const {error} = this.combinationRequestSchema.validate(body, {abortEarly: false})
        if (error) {
            logger.error(error)
            return 0
        }
        try {
            await this.client.connect()
            const query: CombinationFilterQuery = this.buildFiltersQuery(body)

            return await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .countDocuments(query as Filter<any>)
        } catch (err) {
            logger.error(err)
            return 0
        } finally {
            await this.client.close()
        }
    }

    async getCombinations(body: CombinationsRequestBody): Promise<Combination[]> {
        const {error} = this.combinationRequestSchema.validate(body)
        if (error) {
            logger.error(error)
            return []
        }
        try {
            await this.client.connect()
            const query: CombinationFilterQuery = this.buildFiltersQuery(body)

            const sort = {
                [body?.sorting?.column ?? 'Animal 1']:
                    body?.sorting?.order === SortingType.DESCENDING ? (-1 as SortDirection) : (1 as SortDirection),
            }
            const skip = (body.page - 1) * body.perPage
            const limit = body.perPage
            return (await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .find(query as Filter<any>)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray()) as WithId<[]> as Combination[]
        } catch (err: any) {
            logger.error(err)
            return []
        } finally {
            await this.client.close()
        }
    }

    async getAttributeMinMax(body: MinMaxRequestBody) {
        const {error} = this.minMaxSchema.validate(body)
        if (error) {
            return {min: 0, max: Number.MAX_SAFE_INTEGER, error: error}
        }
        try {
            await this.client.connect()
            let minMax = await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .aggregate([
                    {
                        $match: {
                            'Mod.name': body.mod.name,
                            'Mod.version': body.mod.version,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            min: {$min: `$${body.attribute}`},
                            max: {$max: `$${body.attribute}`},
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            min: 1,
                            max: 1,
                        },
                    },
                ])
                .toArray()

            return minMax?.[0] || {min: 0, max: Number.MAX_SAFE_INTEGER}
        } catch (err) {
            logger.error(err)
            return {min: 0, max: Number.MAX_SAFE_INTEGER, error: err}
        } finally {
            await this.client.close()
        }
    }

    async getAbilities(body: {mod: Mod}): Promise<CombinationAbilities[]> {
        const {error} = this.abilitiesRequestSchema.validate(body)
        if (error) {
            logger.error(error)
            return []
        }
        try {
            await this.client.connect()
            return await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .distinct(CombinationAttributeNames.ABILITIES)
        } catch (err) {
            logger.error(err)
            return []
        } finally {
            await this.client.close()
        }
    }

    toCollectionName(mod: Mod | undefined) {
        if (mod === null || mod === undefined) {
            return ''
        }
        return `${mod.name} ${mod.version}`
    }

    buildFiltersQuery(body: CombinationsRequestBody): CombinationFilterQuery {
        const defaultSorting = {column: CombinationAttributeNames.ANIMAL_1, order: SortingType.DESCENDING}
        if (body === null) {
            body = {
                mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                sorting: defaultSorting,
                page: 1,
                perPage: 1,
            }
        }
        let query: CombinationFilterQuery = {
            'Mod.name': body.mod.name,
            'Mod.version': body.mod.version,
        } as CombinationFilterQuery
        if (body?.filters !== null && body?.filters !== undefined) {
            query = {...query, ...this.mapFiltersToQuery(body.filters)}
        }
        return query
    }

    getFilterQueryFromFilterMetaData(
        dataTableFilterMetaData: DataTableFilterMetaData,
        attributeName: CombinationAttributeNames,
    ): CombinationFilterQuery {
        switch (dataTableFilterMetaData.matchMode) {
            case 'startsWith':
                return {
                    [attributeName]: {$regex: new RegExp('^' + escapeRegExp(dataTableFilterMetaData.value), 'i')},
                } as CombinationFilterQuery
            case 'contains':
                return {
                    [attributeName]: {$regex: new RegExp(escapeRegExp(dataTableFilterMetaData.value), 'i')},
                } as CombinationFilterQuery
            case 'notContains':
                return {
                    [attributeName]: {$not: {$regex: new RegExp(escapeRegExp(dataTableFilterMetaData.value), 'i')}},
                } as CombinationFilterQuery
            case 'endsWith':
                return {
                    [attributeName]: {$regex: new RegExp(escapeRegExp(dataTableFilterMetaData.value) + '$', 'i')},
                } as CombinationFilterQuery
            case 'equals':
                return {[attributeName]: dataTableFilterMetaData.value} as CombinationFilterQuery
            case 'in':
                return {[attributeName]: {$in: dataTableFilterMetaData.value}} as CombinationFilterQuery
            case 'lt':
                return {[attributeName]: {$lt: dataTableFilterMetaData.value}} as CombinationFilterQuery
            case 'lte':
                return {[attributeName]: {$lte: dataTableFilterMetaData.value}} as CombinationFilterQuery
            case 'gt':
                return {[attributeName]: {$gt: dataTableFilterMetaData.value}} as CombinationFilterQuery
            case 'gte':
                return {[attributeName]: {$gte: dataTableFilterMetaData.value}} as CombinationFilterQuery
            case 'between':
                return {
                    [attributeName]: {
                        $gte: dataTableFilterMetaData.value[0],
                        $lte: dataTableFilterMetaData.value[1],
                    },
                } as CombinationFilterQuery
            default:
                return {[attributeName]: dataTableFilterMetaData.value} as CombinationFilterQuery
        }
    }

    mergeFilterQueries(
        filterQueries: CombinationFilterQuery[],
        operator?: CombinationQueryFilterOperators,
    ): CombinationFilterQuery {
        switch (operator) {
            case 'AND':
                return {
                    $and: filterQueries,
                } as CombinationFilterQuery
            case 'OR':
                return {
                    $or: filterQueries,
                } as CombinationFilterQuery
            default:
                return {
                    $and: filterQueries,
                } as CombinationFilterQuery
        }
    }

    createFilterQuery(
        attributeName: CombinationAttributeNames,
        dataTableFilterMetaData: DataTableFilterMetaData,
    ): CombinationFilterQuery {
        let filterQuery: CombinationFilterQuery = {} as CombinationFilterQuery
        if (
            dataTableFilterMetaData.value !== null &&
            dataTableFilterMetaData.value !== undefined &&
            dataTableFilterMetaData.matchMode !== null &&
            dataTableFilterMetaData.matchMode !== undefined &&
            attributeName !== null &&
            attributeName !== undefined
        ) {
            filterQuery = this.getFilterQueryFromFilterMetaData(dataTableFilterMetaData, attributeName)
        }
        return filterQuery
    }

    mapFiltersToQuery(filters: DataTableFilterMeta): CombinationFilterQuery {
        let query: CombinationFilterQuery = {} as CombinationFilterQuery
        for (let field in filters) {
            let attribute: CombinationAttributeNames = field as CombinationAttributeNames
            if (
                filters.hasOwnProperty(attribute) &&
                Object.values(CombinationAttributeNames).includes(attribute as CombinationAttributeNames)
            ) {
                let filterAsString: string | null = this.castAsString(filters[attribute])
                let filterAsFilterMetaData: DataTableFilterMetaData | null = this.castAsFilterMetaData(
                    filters[attribute],
                )
                let filterAsOperatorFilterMetaData: DataTableOperatorFilterMetaData | null =
                    this.castAsOperatorFilterMetaData(filters[attribute])
                if (filterAsString && !filterAsFilterMetaData && !filterAsOperatorFilterMetaData) {
                    ;(query as CombinationFilterQuery)[attribute] = {$regex: new RegExp(escapeRegExp(filterAsString), 'i')}
                } else if (!filterAsString && filterAsFilterMetaData && !filterAsOperatorFilterMetaData) {
                    query = {...query, ...this.createFilterQuery(attribute, filterAsFilterMetaData)}
                } else if (!filterAsString && !filterAsFilterMetaData && filterAsOperatorFilterMetaData) {
                    if (filterAsOperatorFilterMetaData?.constraints?.length > 1) {
                        let mergedFilterQueries = this.mergeFilterQueries(
                            filterAsOperatorFilterMetaData?.constraints.map(
                                (dataTableFilterMetaData: DataTableFilterMetaData) => {
                                    return this.createFilterQuery(attribute, dataTableFilterMetaData)
                                },
                            ),
                            filterAsOperatorFilterMetaData.operator as CombinationQueryFilterOperators,
                        )
                        if (
                            query?.$and &&
                            filterAsOperatorFilterMetaData.operator === CombinationQueryFilterOperators.AND
                        ) {
                            if (Array.isArray(query.$and)) {
                                if (mergedFilterQueries?.$and && Array.isArray(mergedFilterQueries.$and)) {
                                    query.$and = [...query.$and, ...mergedFilterQueries.$and]
                                } else {
                                    query.$and = [...query.$and, mergedFilterQueries]
                                }
                            }
                        }
                        if (
                            query?.$or &&
                            filterAsOperatorFilterMetaData.operator === CombinationQueryFilterOperators.OR
                        ) {
                            if (Array.isArray(query.$or)) {
                                if (mergedFilterQueries?.$or && Array.isArray(mergedFilterQueries.$or)) {
                                    query.$or = [...query.$or, ...mergedFilterQueries.$or]
                                } else {
                                    query.$or = [...query.$or, mergedFilterQueries]
                                }
                            }
                        } else {
                            if (filterAsOperatorFilterMetaData.operator === CombinationQueryFilterOperators.AND) {
                                if (mergedFilterQueries?.$and && Array.isArray(mergedFilterQueries.$and)) {
                                    query.$and = mergedFilterQueries.$and as CombinationFilterQuery[]
                                }
                            }
                            if (filterAsOperatorFilterMetaData.operator === CombinationQueryFilterOperators.OR) {
                                if (mergedFilterQueries?.$or && Array.isArray(mergedFilterQueries.$or)) {
                                    query.$or = mergedFilterQueries.$or as CombinationFilterQuery[]
                                }
                            } else {
                                query = {...query, ...mergedFilterQueries}
                            }
                        }
                    } else if (filterAsOperatorFilterMetaData?.constraints?.length === 1) {
                        let constraint = filterAsOperatorFilterMetaData.constraints[0]
                        if (constraint) {
                            query = {...query, ...this.createFilterQuery(attribute, constraint)}
                        }
                    }
                }
            }
        }
        return query
    }

    castAsString(value: any): string | null {
        return typeof value === 'string' && !(typeof value === 'object') ? value : null
    }

    castAsFilterMetaData(value: any): DataTableFilterMetaData | null {
        return typeof value === 'object' && value.hasOwnProperty('value') && value.hasOwnProperty('matchMode')
            ? value
            : null
    }

    castAsOperatorFilterMetaData(value: any): DataTableOperatorFilterMetaData | null {
        return typeof value === 'object' && value.hasOwnProperty('operator') && value.hasOwnProperty('constraints')
            ? value
            : null
    }
}

export default CombinationsService
