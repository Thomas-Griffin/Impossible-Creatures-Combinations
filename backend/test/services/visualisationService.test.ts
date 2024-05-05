import VisualisationsService from '../../services/visualisationsService';
import ChartRequestBody from '../../types/ChartRequestBody';
import MongoService from '../../services/mongoService';

const visualisationsService = new VisualisationsService(MongoService.getInstance());

beforeEach(async () => {
    await visualisationsService.client.connect();
    await visualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
    return await visualisationsService.client.close();
});

afterAll(async () => {
    await visualisationsService.client.connect();
    await visualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
    return await visualisationsService.client.close();
});

describe('Visualisation Service', () => {
    describe('getAttributeChart', () => {
        it('should return an attribute chart for the specified combination attribute', async () => {
            await visualisationsService.client.connect();
            await visualisationsService.client
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
            const result = await visualisationsService.getAttributeChart({
                mod: {name: 'Impossible Creatures', version: '1.1'},
                attributes: {x: 'Research Level', y: 'None'},
            } as ChartRequestBody);
            expect(result).toEqual([
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

    describe('getXPerYChart', () => {
        it('should return an x per y chart for the specified combination attributes', async () => {
            await visualisationsService.client.connect();
            await visualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection('Impossible Creatures 1.1')
                .insertMany([
                    {
                        'Research Level': 1,
                        Coal: 11,
                    },
                    {
                        'Research Level': 2,
                        Coal: 22,
                    },
                    {
                        'Research Level': 3,
                        Coal: 33,
                    },
                    {
                        'Research Level': 4,
                        Coal: 44,
                    },
                    {
                        'Research Level': 5,
                        Coal: 55,
                    },
                    {
                        'Research Level': 5,
                        Coal: 56,
                    },
                    {
                        'Research Level': 5,
                        Coal: 57,
                    },
                ]);
            const result = await visualisationsService.getXPerYChart({
                mod: {name: 'Impossible Creatures', version: '1.1'},
                attributes: {x: 'Coal', y: 'Research Level'},
            } as ChartRequestBody);
            expect(result).toEqual([
                {
                    name: 'Research Level: 1',
                    text: 'Coal 11 Research Level: 1',
                    type: 'bar',
                    x: [1],
                    y: [1],
                },
                {
                    name: 'Research Level: 2',
                    text: 'Coal 22 Research Level: 2',
                    type: 'bar',
                    x: [2],
                    y: [1],
                },
                {
                    name: 'Research Level: 3',
                    text: 'Coal 33 Research Level: 3',
                    type: 'bar',
                    x: [3],
                    y: [1],
                },
                {
                    name: 'Research Level: 4',
                    text: 'Coal 44 Research Level: 4',
                    type: 'bar',
                    x: [4],
                    y: [1],
                },
                {
                    name: 'Research Level: 5',
                    text: 'Coal 55 - 57 Research Level: 5',
                    type: 'bar',
                    x: [5],
                    y: [3],
                },
            ]);
        });
    });
});
