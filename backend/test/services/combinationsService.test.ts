import CombinationService from '../../src/services/combinationsService';
import {
    testCombination1,
    testCombination2,
    testCombination3,
    testMod,
    testModsCollectionName,
} from '../constants/globalTestConstants';
import SortingType from '../../src/types/SortingType';
import GetCombinationsRequestBody from '../../src/types/GetCombinationsRequestBody';
import {MinMaxRequestBody} from '../../src/types/MinMaxRequestBody';
import {COMBINATIONS_COLLECTION_NAME} from '../../globalConstants';
import {DataTableFilterMetaData, DataTableOperatorFilterMetaData} from 'primevue/datatable';
import {FilterMatchMode} from 'primevue/api';

const combinationsService = new CombinationService();

describe('CombinationsService', () => {
    beforeAll(async () => {
        await combinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(COMBINATIONS_COLLECTION_NAME)
            .insertMany([testCombination1, testCombination2, testCombination3]);
        await combinationsService.client.db(process.env['MONGO_DB_NAME']).collection(testModsCollectionName).insertOne({
            name: testMod.name,
            version: testMod.version,
            columns: testMod.columns,
        });
    });

    describe('getCombinations', () => {
        it('should return all combinations', async () => {
            let body = {
                mod: testMod,
                page: 1,
                perPage: 10,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getCombinations(body);
            expect(combinations).toHaveLength(3);
        });
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
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getCombinations(body);
            expect(combinations).toEqual([]);
        });
        it('should return an empty array if pageNumber is less than 1', async function () {
            let body = {
                mod: testMod,
                page: 0,
                perPage: 10,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getCombinations(body);
            expect(combinations).toEqual([]);
        });
        it('should return an empty array if nPerPage is less than 1', async function () {
            let body = {
                mod: testMod,
                page: 1,
                perPage: 0,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getCombinations(body);
            expect(combinations).toEqual([]);
        });
    });
    describe('getTotalCombinations', () => {
        it('should return the total number of combinations', async () => {
            let body = {
                mod: testMod,
                filters: {},
                sorting: {
                    column: 'Research Level',
                    order: SortingType.Ascending,
                },
                page: 1,
                perPage: 10,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getTotalCombinations(body);
            expect(combinations).toBe(3);
        });
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
                    order: SortingType.Ascending,
                },
                page: 1,
                perPage: 10,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getTotalCombinations(body);
            expect(combinations).toEqual(0);
        });
        it('should still return a result if sorting is undefined', async () => {
            let body = {
                mod: testMod,
                filters: {},
                sorting: undefined,
                page: 1,
                perPage: 10,
            } as GetCombinationsRequestBody;
            const combinations = await combinationsService.getTotalCombinations(body);
            expect(combinations).toEqual(3);
        });
    });
    describe('getAttributeMinMax', () => {
        it('should return the min and max values for an attribute', async () => {
            let body = {
                mod: testMod,
                attribute: 'Research Level',
            } as MinMaxRequestBody;
            const combinations = await combinationsService.getAttributeMinMax(body);
            expect(combinations).toEqual({min: 1, max: 3});
        });
        it("should return a default min max with an error if the mod doesn't exist", async () => {
            let body = {
                mod: {
                    name: 'fakeMod',
                    version: '1.0.0',
                    columns: [],
                },
                attribute: 'Research Level',
            } as MinMaxRequestBody;
            const combinations = await combinationsService.getAttributeMinMax(body);
            expect(combinations).toHaveProperty('error');
        });
    });
    describe('mapFiltersToQuery', () => {
        it('should return an empty filter query if no filters are passed', () => {
            expect(combinationsService.mapFiltersToQuery({})).toEqual({});
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
            });
        });
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
                                $regex: RegExp('!', 'i'),
                            },
                        },
                    },
                ],
            });
        });
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
                                $regex: RegExp('!', 'i'),
                            },
                        },
                    },
                ],
            });
        });
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
                                $regex: RegExp('!', 'i'),
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
                                $regex: RegExp('!?', 'i'),
                            },
                        },
                    },
                ],
            });
        });
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
                                $regex: RegExp('!', 'i'),
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
                                $regex: RegExp('!?', 'i'),
                            },
                        },
                    },
                ],
            });
        });
        it('should handle Ability filter (Ability.ability)', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Abilities.ability': {value: 'Digging', matchMode: FilterMatchMode.EQUALS},
                })
            ).toEqual({'Abilities.ability': 'Digging'});
        });
        it('should handle Ability filter (Ability.source)', () => {
            expect(
                combinationsService.mapFiltersToQuery({
                    'Abilities.source': {value: 'Innate', matchMode: FilterMatchMode.EQUALS},
                })
            ).toEqual({'Abilities.source': 'Innate'});
        });
    });
});
