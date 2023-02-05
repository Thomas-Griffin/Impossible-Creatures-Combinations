const ModService = require('../../services/modService');
const testModService = new ModService()

describe('ModService', () => {
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


    describe('getMods', () => {
        it('should return all mods', async () => {
            const mods = await testModService.getMods();
            expect(mods).toHaveLength(3);
        });
    });
});
