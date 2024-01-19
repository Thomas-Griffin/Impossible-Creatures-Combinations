import modService from '../../services/modService';
import app from '../../app';
import request from 'supertest';
import {testModsCollectionName} from '../constants/globalTestConstants';

const testModService = new modService();
describe('Mods routes', () => {
    beforeEach(async () => {
        await testModService.client.connect();
        await testModService.client.db(process.env['MONGO_DB_NAME']).collection(testModsCollectionName).drop();
        await testModService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(testModsCollectionName)
            .insertMany([
                {
                    name: 'test1',
                    version: '1.0.1',
                },
                {
                    name: 'test2',
                    version: '1.0.2',
                },
                {
                    name: 'test3',
                    version: '1.0.3',
                },
            ]);
        return await testModService.client.close();
    });
    afterEach(async () => {
        await testModService.client.connect();
        await testModService.client.db(process.env['MONGO_DB_NAME']).collection(testModsCollectionName).drop();
        return await testModService.client.close();
    });
    afterAll(async () => {
        await testModService.client.connect();
        await testModService.client.db(process.env['MONGO_DB_NAME']).collection(testModsCollectionName).drop();
        return await testModService.client.close();
    });

    describe('GET /combinations/name/:name', () => {
        it('should return a mod by name', async () => {
            await testModService.client.connect();
            const response = await request(app).get('/mods/name/test1');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(1);
        });
    });

    describe('GET /combinations', () => {
        it('should return all combinations', async () => {
            await testModService.client.connect();
            const response = await request(app).get('/mods');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(3);
        });
    });
});
