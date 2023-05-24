const modService = require('../../services/modService');
const testModService = new modService()
const app = require('../../app');
const request = require('supertest');


describe('Mods routes', () => {
    beforeEach(async () => {
        await testModService.connect();
        await testModService.db.collection('mods_test').insertMany([
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
            }
        ]);
    });

    afterEach(async () => {
        await testModService.db.collection('mods_test').drop();
    });

    afterAll(async () => {
        await testModService.client.close();
    });


    describe('GET /mods/name/:name', () => {
        it('should return a mod by name', async () => {
            const response = await request(app).get('/mods/name/test1')
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(1)
        });
    });

    describe('GET /mods', () => {
        it('should return all mods', async () => {
            const response = await request(app).get('/mods')
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(3);
        });
    });


});




