import app from '../../app';
import request from 'supertest';
import VisualisationsService from '../../src/services/visualisationsService';
import {COMBINATIONS_COLLECTION_NAME} from '../../globalConstants';
import {testMod} from '../constants/globalTestConstants';

const testVisualisationsService = new VisualisationsService();
describe('Visualisations routes', () => {
    describe('getAttributeChart', () => {
        it('should return an attribute chart for the specified combination attribute', async () => {
            await testVisualisationsService.client.connect();
            await testVisualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .insertMany([
                    {
                        Mod: testMod,
                        'Research Level': 1,
                        'Animal 1': 'testAnimal1',
                        'Animal 2': 'testAnimal2',
                    },
                    {
                        Mod: testMod,
                        'Research Level': 2,
                        'Animal 1': 'testAnimal3',
                        'Animal 2': 'testAnimal4',
                    },
                    {
                        Mod: testMod,
                        'Research Level': 3,
                        'Animal 1': 'testAnimal5',
                        'Animal 2': 'testAnimal6',
                    },
                    {
                        Mod: testMod,
                        'Research Level': 4,
                        'Animal 1': 'testAnimal7',
                        'Animal 2': 'testAnimal8',
                    },
                    {
                        Mod: testMod,
                        'Research Level': 5,
                        'Animal 1': 'testAnimal9',
                        'Animal 2': 'testAnimal10',
                    },
                ]);

            await request(app)
                .post('/visualisations/attribute-chart')
                .send({
                    mod: testMod,
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
                ]);
        });
    });
});
