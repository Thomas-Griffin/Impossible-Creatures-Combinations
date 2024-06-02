import request from 'supertest'

import VisualisationsService from '../../../src/backend/services/visualisationsService'
import {COMBINATIONS_COLLECTION_NAME, DEFAULT_MOD} from '../../../src/globals'
import app from '../../../src/backend/app'

describe('Visualisations routes', () => {
    const testVisualisationsService = new VisualisationsService()

    beforeEach(async () => {
        await testVisualisationsService.client.connect()
        await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await testVisualisationsService.client.close()
    })

    afterEach(async () => {
        await testVisualisationsService.client.connect()
        await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await testVisualisationsService.client.close()
    })

    describe('getAttributeChart', () => {
        it('should return an attribute chart for the specified combination attribute', async () => {
            await testVisualisationsService.client.connect()
            await testVisualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .insertMany([
                    {
                        Mod: DEFAULT_MOD,
                        'Research Level': 1,
                        'Animal 1': 'testAnimal1',
                        'Animal 2': 'testAnimal2',
                    },
                    {
                        Mod: DEFAULT_MOD,
                        'Research Level': 2,
                        'Animal 1': 'testAnimal3',
                        'Animal 2': 'testAnimal4',
                    },
                    {
                        Mod: DEFAULT_MOD,
                        'Research Level': 3,
                        'Animal 1': 'testAnimal5',
                        'Animal 2': 'testAnimal6',
                    },
                    {
                        Mod: DEFAULT_MOD,
                        'Research Level': 4,
                        'Animal 1': 'testAnimal7',
                        'Animal 2': 'testAnimal8',
                    },
                    {
                        Mod: DEFAULT_MOD,
                        'Research Level': 5,
                        'Animal 1': 'testAnimal9',
                        'Animal 2': 'testAnimal10',
                    },
                ])

            await request(app)
                .post('/visualisations/attribute-chart')
                .send({
                    mod: DEFAULT_MOD,
                    attributes: {x: 'Research Level', y: 'None'},
                })
                .expect(200)
                .expect([
                    {
                        text: ['1', '1', '1', '1', '1'],
                        type: 'bar',
                        x: [
                            'Research Level 1',
                            'Research Level 2',
                            'Research Level 3',
                            'Research Level 4',
                            'Research Level 5',
                        ],
                        y: [1, 1, 1, 1, 1],
                    },
                ])
        })
    })
})
