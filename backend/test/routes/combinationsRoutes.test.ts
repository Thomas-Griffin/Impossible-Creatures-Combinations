import app from '../../app';
import request from 'supertest';
import CombinationsService from '../../src/services/combinationsService';
import {
    removeId,
    testCombination1,
    testCombination2,
    testCombination3,
    testMod,
} from '../constants/globalTestConstants';
import {COMBINATIONS_COLLECTION_NAME} from '../../globalConstants';
import GetCombinationsRequestBody from '../../src/types/GetCombinationsRequestBody';
import {DataTableFilterMeta} from 'primevue/datatable';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {CombinationAttributeNames} from '../../src/types/CombinationAttributeNames';

const testCombinationsService = new CombinationsService();

describe('Combinations routes', () => {
    beforeAll(async () => {
        await testCombinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(COMBINATIONS_COLLECTION_NAME)
            .insertMany([testCombination1, testCombination2, testCombination3]);
    });

    describe('Post /combinations', () => {
        it('should return all combinations', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(3);
        });

        it('should return the combinations that match the filter (1 filter, AND operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: 'testanimal1', matchMode: FilterMatchMode.STARTS_WITH}],
                        },
                    } as DataTableFilterMeta,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(1);
            expect(removeId(response.body[0])).toEqual(removeId(testCombination1));
        });
        it('should return the combinations that match the filter (2 filters, AND operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: 'test', matchMode: FilterMatchMode.STARTS_WITH}],
                        },
                        [CombinationAttributeNames.RESEARCH_LEVEL]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: [1, 2], matchMode: FilterMatchMode.BETWEEN}],
                        },
                    } as DataTableFilterMeta,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(2);
            expect(response.body.map(removeId)).toEqual([testCombination1, testCombination2].map(removeId));
        });
        it('should return the combinations that match the filter (2 filters, OR operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.OR,
                            constraints: [{value: '1', matchMode: FilterMatchMode.ENDS_WITH}],
                        },
                        [CombinationAttributeNames.RESEARCH_LEVEL]: {
                            operator: FilterOperator.OR,
                            constraints: [{value: [1, 2], matchMode: FilterMatchMode.BETWEEN}],
                        },
                    } as DataTableFilterMeta,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(1);
            expect(response.body.map(removeId)).toEqual([testCombination1].map(removeId));
        });
    });

    describe('Post /combinations/total', () => {
        it('should return total number of combinations', async () => {
            const response = await request(app)
                .post('/combinations/total')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(3);
        });
        it('should return the correct total filtered combinations', async () => {
            const response = await request(app)
                .post('/combinations/total')
                .send({
                    mod: testMod,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: 'testanimal1', matchMode: FilterMatchMode.STARTS_WITH}],
                        },
                    } as DataTableFilterMeta,
                } as GetCombinationsRequestBody);
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(1);
        });
    });
});
