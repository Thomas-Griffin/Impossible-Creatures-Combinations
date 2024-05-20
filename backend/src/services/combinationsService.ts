import MongoService from './mongoService';
import {readFileSync} from 'fs';
import Mod from '../types/Mod';
import SortingType from '../types/SortingType';
import Joi from 'joi';
import {
    COMBINATIONS_COLLECTION_NAME,
    JOI_MOD_SCHEMA,
    MOD_COLLECTION_NAME,
    TEST_SCHEMA_FILE_PATH,
} from '../../globalConstants';
import ProcessedCombination from '../types/ProcessedCombination';
import Ability from '../types/Ability';
import GetCombinationsRequestBody from '../types/GetCombinationsRequestBody';
import {FilterQuery} from '../types/FilterQuery';
import {MinMaxRequestBody} from '../types/MinMaxRequestBody';
import schemas from '../database/modSchemas';
import {Filter, MongoClient, SortDirection, WithId} from 'mongodb';
import {logger} from '../utility/logger';
import {container} from 'tsyringe';
import CombinationAttributeName from '../types/CombinationAttributeName';
import {CombinationAttributeNames} from '../types/CombinationAttributeNames';
import {DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData} from 'primevue/datatable';
import {FilterOperators} from '../types/FilterOperators';

let mods = schemas;
const testMods = JSON.parse(readFileSync(TEST_SCHEMA_FILE_PATH, 'utf8'));
mods = mods.concat(testMods);

class CombinationsService {
    combinationRequestSchema: Joi.ObjectSchema;
    minMaxSchema: Joi.ObjectSchema;
    abilitiesRequestSchema: Joi.ObjectSchema;
    client: MongoClient;

    constructor() {
        this.client = container.resolve(MongoService).client;
        this.combinationRequestSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
            filters: Joi.object().optional(),
            sorting: Joi.object({
                column: Joi.string().optional(),
                order: Joi.string().valid('ascending', 'descending').optional(),
            }).optional(),
            page: Joi.number().strict().integer().min(1).required(),
            perPage: Joi.number().strict().integer().min(1).required(),
        });

        this.minMaxSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
            attribute: Joi.string().required(),
        });

        this.abilitiesRequestSchema = Joi.object({
            mod: JOI_MOD_SCHEMA.required(),
        });
    }

    async getTotalCombinations(body: GetCombinationsRequestBody): Promise<number> {
        const {error} = this.combinationRequestSchema.validate(body, {abortEarly: false});
        if (error) {
            logger.error(error);
            return 0;
        }
        try {
            await this.client.connect();
            const query: FilterQuery = this.buildFiltersQuery(body);

            return await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .countDocuments(query as Filter<any>);
        } catch (err) {
            logger.error(err);
            return 0;
        } finally {
            await this.client.close();
        }
    }

    async getCombinations(body: GetCombinationsRequestBody): Promise<ProcessedCombination[]> {
        const {error} = this.combinationRequestSchema.validate(body);
        if (error) {
            logger.error(error);
            return [];
        }
        try {
            await this.client.connect();
            const query: FilterQuery = this.buildFiltersQuery(body);

            const sort = {
                [body?.sorting?.column ?? 'Animal 1']:
                    body?.sorting?.order === SortingType.Descending ? (-1 as SortDirection) : (1 as SortDirection),
            };
            const skip = (body.page - 1) * body.perPage;
            const limit = body.perPage;
            return (await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .find(query as Filter<any>)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray()) as WithId<[]> as ProcessedCombination[];
        } catch (err: any) {
            logger.error(err);
            return [];
        } finally {
            await this.client.close();
        }
    }

    async getAttributeMinMax(body: MinMaxRequestBody) {
        const {error} = this.minMaxSchema.validate(body);
        if (error) {
            return {min: 0, max: Number.MAX_SAFE_INTEGER, error: error};
        }
        try {
            await this.client.connect();
            let minMax = await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .aggregate([
                    {$match: {name: body.mod.name, version: body.mod.version}},
                    {$unwind: '$columns'},
                    {$match: {'columns.label': body.attribute}},
                    {$project: {min: '$columns.min', max: '$columns.max', _id: 0}},
                ])
                .toArray();

            return minMax?.[0] || {min: 0, max: Number.MAX_SAFE_INTEGER};
        } catch (err) {
            logger.error(err);
            return {min: 0, max: Number.MAX_SAFE_INTEGER, error: err};
        } finally {
            await this.client.close();
        }
    }

    async getAbilities(body: {mod: Mod}): Promise<Ability[]> {
        const {error} = this.abilitiesRequestSchema.validate(body);
        if (error) {
            logger.error(error);
            return [];
        }
        try {
            await this.client.connect();
            let abilities = await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(this.toCollectionName(body.mod))
                .aggregate([
                    {$unwind: '$Abilities'},
                    {$group: {_id: '$Abilities.ability'}},
                    {$project: {_id: 0, ability: '$_id'}},
                ])
                .toArray();
            return abilities.flatMap(ability => ability['ability']);
        } catch (err) {
            logger.error(err);
            return [];
        } finally {
            await this.client.close();
        }
    }

    toCollectionName(mod: Mod | undefined) {
        if (mod === null || mod === undefined) {
            return '';
        }
        return `${mod.name} ${mod.version}`;
    }

    buildFiltersQuery(body: GetCombinationsRequestBody): FilterQuery {
        const defaultSorting = {column: 'Animal 1' as CombinationAttributeName, order: SortingType.Descending};
        if (body === null) {
            body = {
                mod: mods[0] || {name: '', version: ''},
                sorting: defaultSorting,
                page: 1,
                perPage: 1,
            };
        }
        let query: FilterQuery = {
            'Mod.name': body.mod.name,
            'Mod.version': body.mod.version,
        } as FilterQuery;
        if (body?.filters !== null && body?.filters !== undefined) {
            query = {...query, ...this.mapFiltersToQuery(body.filters)};
        }
        return query;
    }

    getFilterQueryFromFilterMetaData(
        dataTableFilterMetaData: DataTableFilterMetaData,
        attributeName: CombinationAttributeName
    ): FilterQuery {
        switch (dataTableFilterMetaData.matchMode) {
            case 'startsWith':
                return {[attributeName]: {$regex: new RegExp('^' + dataTableFilterMetaData.value, 'i')}} as FilterQuery;
            case 'contains':
                return {[attributeName]: {$regex: new RegExp(dataTableFilterMetaData.value, 'i')}} as FilterQuery;
            case 'notContains':
                return {
                    [attributeName]: {$not: {$regex: new RegExp(dataTableFilterMetaData.value, 'i')}},
                } as FilterQuery;
            case 'endsWith':
                return {[attributeName]: {$regex: new RegExp(dataTableFilterMetaData.value + '$', 'i')}} as FilterQuery;
            case 'equals':
                return {[attributeName]: dataTableFilterMetaData.value} as FilterQuery;
            case 'in':
                return {[attributeName]: {$in: dataTableFilterMetaData.value}} as FilterQuery;
            case 'lt':
                return {[attributeName]: {$lt: dataTableFilterMetaData.value}} as FilterQuery;
            case 'lte':
                return {[attributeName]: {$lte: dataTableFilterMetaData.value}} as FilterQuery;
            case 'gt':
                return {[attributeName]: {$gt: dataTableFilterMetaData.value}} as FilterQuery;
            case 'gte':
                return {[attributeName]: {$gte: dataTableFilterMetaData.value}} as FilterQuery;
            case 'between':
                return {
                    [attributeName]: {
                        $gte: dataTableFilterMetaData.value[0],
                        $lte: dataTableFilterMetaData.value[1],
                    },
                } as FilterQuery;
            default:
                return {[attributeName]: dataTableFilterMetaData.value} as FilterQuery;
        }
    }

    mergeFilterQueries(filterQueries: FilterQuery[], operator?: FilterOperators): FilterQuery {
        switch (operator) {
            case 'AND':
                return {
                    $and: filterQueries,
                } as FilterQuery;
            case 'OR':
                return {
                    $or: filterQueries,
                } as FilterQuery;
            default:
                return {
                    $and: filterQueries,
                } as FilterQuery;
        }
    }

    createFilterQuery(
        attributeName: CombinationAttributeName,
        dataTableFilterMetaData: DataTableFilterMetaData
    ): FilterQuery {
        let filterQuery: FilterQuery = {} as FilterQuery;
        if (
            dataTableFilterMetaData.value !== null &&
            dataTableFilterMetaData.value !== undefined &&
            dataTableFilterMetaData.matchMode !== null &&
            dataTableFilterMetaData.matchMode !== undefined &&
            attributeName !== null &&
            attributeName !== undefined
        ) {
            filterQuery = this.getFilterQueryFromFilterMetaData(dataTableFilterMetaData, attributeName);
        }
        return filterQuery;
    }

    mapFiltersToQuery(filters: DataTableFilterMeta): FilterQuery {
        let query: FilterQuery = {} as FilterQuery;
        for (let field in filters) {
            let attribute: CombinationAttributeName = field as CombinationAttributeName;
            if (
                filters.hasOwnProperty(attribute) &&
                Object.values(CombinationAttributeNames).includes(attribute as CombinationAttributeNames)
            ) {
                let filterAsString: string | null = this.castAsString(filters[attribute]);
                let filterAsFilterMetaData: DataTableFilterMetaData | null = this.castAsFilterMetaData(
                    filters[attribute]
                );
                let filterAsOperatorFilterMetaData: DataTableOperatorFilterMetaData | null =
                    this.castAsOperatorFilterMetaData(filters[attribute]);
                if (filterAsString && !filterAsFilterMetaData && !filterAsOperatorFilterMetaData) {
                    (query as FilterQuery)[attribute] = {$regex: new RegExp(filterAsString, 'i')};
                } else if (!filterAsString && filterAsFilterMetaData && !filterAsOperatorFilterMetaData) {
                    query = {...query, ...this.createFilterQuery(attribute, filterAsFilterMetaData)};
                } else if (!filterAsString && !filterAsFilterMetaData && filterAsOperatorFilterMetaData) {
                    if (filterAsOperatorFilterMetaData?.constraints?.length > 1) {
                        let mergedFilterQueries = this.mergeFilterQueries(
                            filterAsOperatorFilterMetaData?.constraints.map(
                                (dataTableFilterMetaData: DataTableFilterMetaData) => {
                                    return this.createFilterQuery(attribute, dataTableFilterMetaData);
                                }
                            ),
                            filterAsOperatorFilterMetaData.operator as FilterOperators
                        );
                        if (query?.$and && filterAsOperatorFilterMetaData.operator === FilterOperators.AND) {
                            if (Array.isArray(query.$and)) {
                                if (mergedFilterQueries?.$and && Array.isArray(mergedFilterQueries.$and)) {
                                    query.$and = [...query.$and, ...mergedFilterQueries.$and];
                                } else {
                                    query.$and = [...query.$and, mergedFilterQueries];
                                }
                            }
                        }
                        if (query?.$or && filterAsOperatorFilterMetaData.operator === FilterOperators.OR) {
                            if (Array.isArray(query.$or)) {
                                if (mergedFilterQueries?.$or && Array.isArray(mergedFilterQueries.$or)) {
                                    query.$or = [...query.$or, ...mergedFilterQueries.$or];
                                } else {
                                    query.$or = [...query.$or, mergedFilterQueries];
                                }
                            }
                        } else {
                            if (filterAsOperatorFilterMetaData.operator === FilterOperators.AND) {
                                if (mergedFilterQueries?.$and && Array.isArray(mergedFilterQueries.$and)) {
                                    query.$and = mergedFilterQueries.$and as FilterQuery[];
                                }
                            }
                            if (filterAsOperatorFilterMetaData.operator === FilterOperators.OR) {
                                if (mergedFilterQueries?.$or && Array.isArray(mergedFilterQueries.$or)) {
                                    query.$or = mergedFilterQueries.$or as FilterQuery[];
                                }
                            } else {
                                query = {...query, ...mergedFilterQueries};
                            }
                        }
                    } else if (filterAsOperatorFilterMetaData?.constraints?.length === 1) {
                        let constraint = filterAsOperatorFilterMetaData.constraints[0];
                        if (constraint) {
                            query = {...query, ...this.createFilterQuery(attribute, constraint)};
                        }
                    }
                }
            }
        }
        return query;
    }

    castAsString(value: any): string | null {
        return typeof value === 'string' && !(typeof value === 'object') ? value : null;
    }

    castAsFilterMetaData(value: any): DataTableFilterMetaData | null {
        return typeof value === 'object' && value.hasOwnProperty('value') && value.hasOwnProperty('matchMode')
            ? value
            : null;
    }

    castAsOperatorFilterMetaData(value: any): DataTableOperatorFilterMetaData | null {
        return typeof value === 'object' && value.hasOwnProperty('operator') && value.hasOwnProperty('constraints')
            ? value
            : null;
    }
}

export default CombinationsService;
