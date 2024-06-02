import CombinationsService from '../../../src/backend/services/combinationsService'

import {testCombination1, testCombination2, testCombination3} from '../constants/global'

import {COMBINATIONS_COLLECTION_NAME, DEFAULT_MOD, MOD_COLLECTION_NAME} from '../../../src/globals'
import type {DataTableFilterMetaData, DataTableOperatorFilterMetaData} from 'primevue/datatable'
import {FilterMatchMode} from 'primevue/api'
import MinMaxRequestBody from '../../../src/types/MinMaxRequestBody'
import CombinationsRequestBody from '../../../src/types/CombinationsRequestBody'
import SortingType from '../../../src/types/SortingType'
import CombinationAttributeNames from '../../../src/types/CombinationAttributeNames'
import CombinationAbilities from '../../../src/types/CombinationAbilities'
import AbilitySources from '../../../src/types/AbilitySources'
import {escapeRegExp} from 'lodash'

describe('CombinationsService', () => {
    const combinationsService = new CombinationsService()

    beforeEach(async () => {
        await combinationsService.client.connect()
        await combinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(COMBINATIONS_COLLECTION_NAME)
            .insertMany([testCombination1, testCombination2, testCombination3])
        await combinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(MOD_COLLECTION_NAME)
            .insertOne(DEFAULT_MOD)
        await combinationsService.client.close()
    })

    afterEach(async () => {
        await combinationsService.client.connect()
        await combinationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await combinationsService.client.close()
    })

    describe('getCombinations', () => {
        it('should return all combinations', async () => {
            let body = {
                mod: DEFAULT_MOD,
                page: 1,
                perPage: 10,
            } as CombinationsRequestBody
            const combinations = await combinationsService.getCombinations(body)
            expect(combinations).toHaveLength(3)
        })
        it("should return an empty array if the mod doesn't exist", async () => {
            let body = {
                mod: {
                    name: 'fakeMod',
                    version: '1.0.0',
                    columns: [],
                },
                filters: {},
                page: 1,
                perPage: 10,
            } as unknown as CombinationsRequestBody
            const combinations = await combinationsService.getCombinations(body)
            expect(combinations).toEqual([])
        })
        it('should return an empty array if pageNumber is less than 1', async function () {
            let body = {
                mod: DEFAULT_MOD,
                page: 0,
                perPage: 10,
            } as CombinationsRequestBody
            const combinations = await combinationsService.getCombinations(body)
            expect(combinations).toEqual([])
        })
        it('should return an empty array if nPerPage is less than 1', async function () {
            let body = {
                mod: DEFAULT_MOD,
                page: 1,
                perPage: 0,
            } as CombinationsRequestBody
            const combinations = await combinationsService.getCombinations(body)
            expect(combinations).toEqual([])
        })
    })
    describe('getTotalCombinations', () => {
        it('should return the total number of combinations', async () => {
            let body = {
                mod: DEFAULT_MOD,
                filters: {},
                sorting: {
                    column: 'Research Level',
                    order: SortingType.ASCENDING,
                },
                page: 1,
                perPage: 10,
            } as CombinationsRequestBody
            const combinations = await combinationsService.getTotalCombinations(body)
            expect(combinations).toBe(3)
        })
        it("should return 0 if the mod doesn't exist", async () => {
            let body = {
                mod: {
                    name: 'fakeMod',
                    version: '1.0.0',
                    columns: [],
                },
                filters: {},
                sorting: {
                    column: 'Research Level',
                    order: SortingType.ASCENDING,
                },
                page: 1,
                perPage: 10,
            } as unknown as CombinationsRequestBody
            const combinations = await combinationsService.getTotalCombinations(body)
            expect(combinations).toEqual(0)
        })
        it('should still return a result if sorting is undefined', async () => {
            let body = {
                mod: DEFAULT_MOD,
                filters: {},
                sorting: undefined,
                page: 1,
                perPage: 10,
            } as CombinationsRequestBody
            const combinations = await combinationsService.getTotalCombinations(body)
            expect(combinations).toEqual(3)
        })
    })
    describe('getAttributeMinMax', () => {
        it('should return the min and max values for an attribute', async () => {
            let body = {
                mod: DEFAULT_MOD,
                attribute: 'Research Level',
            } as MinMaxRequestBody
            const combinations = await combinationsService.getAttributeMinMax(body)
            expect(combinations).toEqual({min: 1, max: 3})
        })
        it("should return a default min max with an error if the mod doesn't exist", async () => {
            let body = {
                mod: {
                    name: 'fakeMod',
                    version: '1.0.0',
                    columns: [],
                },
                attribute: 'Research Level',
            } as unknown as MinMaxRequestBody
            const combinations = await combinationsService.getAttributeMinMax(body)
            expect(combinations).toHaveProperty('error')
        })
    })
    describe('mapFiltersToQuery', () => {
        it('should return an empty filter query if no filters are passed', () => {
            expect(combinationsService.mapFiltersToQuery({})).toEqual({})
        })
        it('should map correctly a string `startsWith` filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        matchMode: 'startsWith',
                        value: 'test',
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Animal 1': {$regex: RegExp('^test', 'i')},
            })
        })
        it('should map correctly a string `endsWith` filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        matchMode: 'endsWith',
                        value: 'test',
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Animal 1': {$regex: RegExp('test$', 'i')},
            })
        })
        it('should map correctly a `between` filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Research Level': {
                        matchMode: 'between',
                        value: [1, 3],
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Research Level': {$gte: 1, $lte: 3},
            })
        })
        it('should map correctly an contains filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        matchMode: 'contains',
                        value: 'test',
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Animal 1': {$regex: RegExp('test', 'i')},
            })
        })
        it('should map correctly an `equals` filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        matchMode: 'equals',
                        value: 'test',
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Animal 1': 'test',
            })
        })
        it('should map correctly a `in` filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        matchMode: 'in',
                        value: ['test1', 'test2'],
                    } as DataTableFilterMetaData,
                })
            ).toEqual({
                'Animal 1': {$in: ['test1', 'test2']},
            })
        })
        it('should map correctly a DataTableOperatorFilterMetaData filter', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'AND',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                        ],
                    } as DataTableOperatorFilterMetaData,
                })
            ).toEqual({
                'Animal 1': {$regex: RegExp('^test', 'i')},
            })
        })
        it('should map correctly a DataTableOperatorFilterMetaData filter with multiple constraints', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'AND',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal1',
                            },
                        ],
                    } as DataTableOperatorFilterMetaData,
                })
            ).toEqual({
                $and: [
                    {
                        'Animal 1': {
                            $regex: RegExp('^test', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $regex: RegExp('Animal1$', 'i'),
                        },
                    },
                ],
            })
        })
        it('should handle multiple `AND` filters', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'AND',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal1',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!',
                            },
                        ],
                    } as DataTableOperatorFilterMetaData,
                })
            ).toEqual({
                $and: [
                    {
                        'Animal 1': {
                            $regex: RegExp('^test', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $regex: RegExp('Animal1$', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!'), 'i'),
                            },
                        },
                    },
                ],
            })
        })
        it('should handle multiple `OR` filters', async () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'OR',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal1',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!',
                            },
                        ],
                    },
                })
            ).toEqual({
                $or: [
                    {
                        'Animal 1': {
                            $regex: RegExp('^test', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $regex: RegExp('Animal1$', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!'), 'i'),
                            },
                        },
                    },
                ],
            })
        })
        it('should handle mulitple `OR` operators', async () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'OR',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal1',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!',
                            },
                        ],
                    },
                    'Animal 2': {
                        operator: 'OR',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test2',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal2',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!?',
                            },
                        ],
                    },
                })
            ).toEqual({
                $or: [
                    {
                        'Animal 1': {
                            $regex: RegExp('^test', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $regex: RegExp('Animal1$', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!'), 'i'),
                            },
                        },
                    },
                    {
                        'Animal 2': {
                            $regex: RegExp('^test2', 'i'),
                        },
                    },
                    {
                        'Animal 2': {
                            $regex: RegExp('Animal2$', 'i'),
                        },
                    },
                    {
                        'Animal 2': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!?'), 'i'),
                            },
                        },
                    },
                ],
            })
        })
        it('should handle AND and OR filters together', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Animal 1': {
                        operator: 'AND',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal1',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!',
                            },
                        ],
                    },
                    'Animal 2': {
                        operator: 'OR',
                        constraints: [
                            {
                                matchMode: 'startsWith',
                                value: 'test2',
                            },
                            {
                                matchMode: 'endsWith',
                                value: 'Animal2',
                            },
                            {
                                matchMode: 'notContains',
                                value: '!?',
                            },
                        ],
                    },
                })
            ).toEqual({
                $and: [
                    {
                        'Animal 1': {
                            $regex: RegExp('^test', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $regex: RegExp('Animal1$', 'i'),
                        },
                    },
                    {
                        'Animal 1': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!'), 'i'),
                            },
                        },
                    },
                ],
                $or: [
                    {
                        'Animal 2': {
                            $regex: RegExp('^test2', 'i'),
                        },
                    },
                    {
                        'Animal 2': {
                            $regex: RegExp('Animal2$', 'i'),
                        },
                    },
                    {
                        'Animal 2': {
                            $not: {
                                $regex: RegExp(escapeRegExp('!?'), 'i'),
                            },
                        },
                    },
                ],
            })
        })
        it('should handle filtering by Ability', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    [CombinationAttributeNames.ABILITIES]: {
                        value: CombinationAbilities.DIGGING,
                        matchMode: FilterMatchMode.IN,
                    },
                })
            ).toEqual({Abilities: {$in: CombinationAbilities.DIGGING}})
        })
        it('should handle filtering by Ability Source', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    [CombinationAttributeNames.ABILITY_SOURCES]: {
                        value: AbilitySources.INNATE,
                        matchMode: FilterMatchMode.IN,
                    },
                })
            ).toEqual({'Ability Sources': {$in: AbilitySources.INNATE}})
        })
    })
    describe('getAbilities', () => {
        it('should return the abilities', async () => {
            let body = {
                mod: DEFAULT_MOD,
            }
            const abilities = await combinationsService.getAbilities(body)
            expect(abilities).toHaveLength(1)
            expect(abilities[0]).toEqual(CombinationAbilities.DIGGING)
        })
    })
})
