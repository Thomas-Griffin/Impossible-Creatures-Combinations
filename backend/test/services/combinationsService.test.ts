import CombinationService from '../../src/services/combinationsService';
import {testMod, testModsCollectionName} from '../constants/globalTestConstants';
import SortingType from '../../src/types/SortingType';
import GetCombinationsRequestBody from '../../src/types/GetCombinationsRequestBody';
import {MinMaxRequestBody} from '../../src/types/MinMaxRequestBody';
import {COMBINATIONS_COLLECTION_NAME} from '../../globalConstants';
import {DataTableFilterMetaData, DataTableOperatorFilterMetaData} from 'primevue/datatable';

const combinationsService = new CombinationService();

describe('CombinationsService', () => {
    beforeAll(async () => {
        await combinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(COMBINATIONS_COLLECTION_NAME)
            .insertMany([
                {
                    Mod: testMod,
                    'Animal 1': 'testAnimal1',
                    'Animal 2': 'testAnimal2',
                    'Research Level': 1,
                    Power: 2,
                    'Air Speed': 3,
                    'Land Speed': 4,
                    'Water Speed': 5,
                    Health: 6,
                    Size: 7,
                    'Population Cost': 8,
                    EHP: 9,
                    'Melee Damage': 10,
                    'Sight Radius': 11,
                    'Front Legs': 'testAnimal1',
                    'Rear Legs': 'testAnimal1',
                    Head: 'testAnimal2',
                    Tail: 'testAnimal2',
                    Torso: 'testAnimal2',
                    Pincers: 'testAnimal1',
                    Wings: 'testAnimal1',
                },
                {
                    Mod: testMod,
                    'Animal 1': 'testAnimal3',
                    'Animal 2': 'testAnimal4',
                    'Research Level': 2,
                    Power: 22,
                    'Air Speed': 32,
                    'Land Speed': 42,
                    'Water Speed': 52,
                    Health: 62,
                    Size: 72,
                    'Population Cost': 82,
                    EHP: 92,
                    'Melee Damage': 102,
                    'Sight Radius': 112,
                    'Front Legs': 'testAnimal3',
                    'Rear Legs': 'testAnimal4',
                    Head: 'testAnimal3',
                    Tail: 'testAnimal3',
                    Torso: 'testAnimal3',
                    Pincers: 'testAnimal4',
                    Wings: 'testAnimal4',
                },
                {
                    Mod: testMod,
                    'Animal 1': 'testAnimal5',
                    'Animal 2': 'testAnimal6',
                    'Research Level': 3,
                    Power: 23,
                    'Air Speed': 33,
                    'Land Speed': 43,
                    'Water Speed': 53,
                    Health: 63,
                    Size: 73,
                    'Population Cost': 83,
                    EHP: 93,
                    'Melee Damage': 103,
                    'Sight Radius': 113,
                    'Front Legs': 'testAnimal5',
                    'Rear Legs': 'testAnimal5',
                    Head: 'testAnimal6',
                    Tail: 'testAnimal6',
                    Torso: 'testAnimal6',
                    Pincers: 'testAnimal5',
                    Wings: 'testAnimal5',
                },
            ]);
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
    });
});
