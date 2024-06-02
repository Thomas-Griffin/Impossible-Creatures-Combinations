import {testCombination1, testCombination2, testCombination3} from '../constants/global'
import {COMBINATIONS_COLLECTION_NAME, DEFAULT_MOD} from '../../../src/globals'

import type {DataTableFilterMeta} from 'primevue/datatable'
import {FilterMatchMode, FilterOperator} from 'primevue/api'
import CombinationsService from '../../../src/backend/services/combinationsService'
import app from '../../../src/backend/app'
import request from 'supertest'
import CombinationsRequestBody from '../../../src/types/CombinationsRequestBody'
import CombinationAttributeNames from '../../../src/types/CombinationAttributeNames'
import {removeId} from '../utility/removeId'

describe('Combinations routes', () => {
    const combinationsService = new CombinationsService()

    beforeEach(async () => {
        await combinationsService.client.connect()
        await combinationsService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(COMBINATIONS_COLLECTION_NAME)
            .insertMany([testCombination1, testCombination2, testCombination3])
        await combinationsService.client.close()
    })

    afterEach(async () => {
        await combinationsService.client.connect()
        await combinationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await combinationsService.client.close()
    })

    afterAll(async () => {
        await combinationsService.client.connect()
        await combinationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await combinationsService.client.close()
    })

    describe('Post /combinations', () => {
        it('should return all combinations', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(3)
        })

        it('should return the combinations that match the filter (1 filter, AND operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: 'testanimal1', matchMode: FilterMatchMode.STARTS_WITH}],
                        },
                    } as DataTableFilterMeta,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(1)
            expect(removeId(response.body[0])).toEqual(removeId(testCombination1))
        })
        it('should return the combinations that match the filter (2 filters, AND operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
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
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(2)
            expect(response.body.map(removeId)).toEqual([testCombination1, testCombination2].map(removeId))
        })
        it('should return the combinations that match the filter (2 filters, OR operator)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
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
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(1)
            expect(response.body.map(removeId)).toEqual([testCombination1].map(removeId))
        })
        it('should return the combinations that match the filter (Abilities.ability)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ABILITIES]: {
                            value: ['Digging'],
                            matchMode: FilterMatchMode.IN,
                        },
                    } as DataTableFilterMeta,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(1)
            expect(removeId(response.body[0])).toEqual(removeId(testCombination2))
        })
        it('should return the combinations that match the filter (Abilities.source)', async () => {
            const response = await request(app)
                .post('/combinations')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ABILITY_SOURCES]: {
                            value: ['Innate'],
                            matchMode: FilterMatchMode.IN,
                        },
                    } as DataTableFilterMeta,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body.length).toEqual(1)
            expect(removeId(response.body[0])).toEqual(removeId(testCombination2))
        })
    })

    describe('Post /combinations/total', () => {
        it('should return total number of combinations', async () => {
            const response = await request(app)
                .post('/combinations/total')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual(3)
        })
        it('should return the correct total filtered combinations', async () => {
            const response = await request(app)
                .post('/combinations/total')
                .send({
                    mod: DEFAULT_MOD,
                    page: 1,
                    perPage: 10,
                    filters: {
                        [CombinationAttributeNames.ANIMAL_1]: {
                            operator: FilterOperator.AND,
                            constraints: [{value: 'testanimal1', matchMode: FilterMatchMode.STARTS_WITH}],
                        },
                    } as DataTableFilterMeta,
                } as CombinationsRequestBody)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual(1)
        })
    })
})
