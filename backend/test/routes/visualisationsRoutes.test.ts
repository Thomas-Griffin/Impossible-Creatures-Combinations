import app from '../../app';
import request from 'supertest';
import VisualisationsService from '../../src/services/visualisationsService';
import MongoService from '../../src/services/mongoService';

const testVisualisationsService = new VisualisationsService(MongoService.getInstance());
describe('Visualisations routes', () => {
    beforeAll(async () => {
        await testVisualisationsService.client.connect();
        await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
        return await testVisualisationsService.client.close();
    });
    afterEach(async () => {
        await testVisualisationsService.client.connect();
        await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
        return await testVisualisationsService.client.close();
    });
    afterAll(async () => {
        await testVisualisationsService.client.connect();
        await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
        return await testVisualisationsService.client.close();
    });

    describe('getAttributeChart', () => {
        it('should return an attribute chart for the specified combination attribute', async () => {
            await testVisualisationsService.client.connect();
            await testVisualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection('Impossible Creatures 1.1')
                .insertMany([
                    {
                        'Research Level': 1,
                        'Animal 1': 'testAnimal1',
                        'Animal 2': 'testAnimal2',
                    },
                    {
                        'Research Level': 2,
                        'Animal 1': 'testAnimal3',
                        'Animal 2': 'testAnimal4',
                    },
                    {
                        'Research Level': 3,
                        'Animal 1': 'testAnimal5',
                        'Animal 2': 'testAnimal6',
                    },
                    {
                        'Research Level': 4,
                        'Animal 1': 'testAnimal7',
                        'Animal 2': 'testAnimal8',
                    },
                    {
                        'Research Level': 5,
                        'Animal 1': 'testAnimal9',
                        'Animal 2': 'testAnimal10',
                    },
                ]);

            await request(app)
                .post('/visualisations/attribute-chart')
                .send({
                    mod: {name: 'Impossible Creatures', version: '1.1'},
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
