const DatabaseService = require('../../services/databaseService');
const {
    testDatabaseName,
    testMod,
    testModCollectionName,
    totalNumberOfMods,
    modsCollectionName,
    testUnprocessedCombinations,
    testProcessedCombinations,
    testModSchema
} = require('../constants/globalTestConstants');
let databaseService;
beforeAll(async () => {
    databaseService = new DatabaseService();
});
beforeEach(async () => {
    await databaseService.client.db(testDatabaseName).dropDatabase();
});
afterAll(async () => {
    await databaseService.client.close();
});
describe('Database service tests', () => {
    describe('create database', () => {
        it('should create the correct database', async () => {
            await databaseService.createDatabase();
            databaseService.client.db(testDatabaseName).collection(testModCollectionName).insertOne(testMod); // must insert something for collection to show up in list
            const databaseNames = (await databaseService.client.db('admin').admin().listDatabases()).databases.map(database => database.name);
            expect(databaseNames).toContain(testDatabaseName);
        });
        it('should create an empty database', async () => {
            await databaseService.createDatabase();
            const collections = await databaseService.client.db(testDatabaseName).listCollections().toArray();
            expect(collections).toEqual([]);
        });
    });
    describe('create mods collection', () => {
        it('should create the mod collection', async () => {
            await databaseService.createDatabase();
            await databaseService.createModsCollection();
            const collections = await databaseService.client.db(testDatabaseName).listCollections().toArray();
            const collectionNames = collections.map(collection => collection.name);
            expect(collectionNames).toContain(modsCollectionName);
        });
        it('should create only the mods collection', async () => {
            await databaseService.createDatabase();
            await databaseService.createModsCollection();
            const collections = await databaseService.client.db(testDatabaseName).listCollections().toArray();
            expect(collections).toHaveLength(1);
        });
    });
    describe('create mod collections', () => {
        it('should create every required mod collection', async () => {
            await databaseService.createDatabase();
            await databaseService.createModCollections();
            const collections = await databaseService.client.db(testDatabaseName).listCollections().toArray();
            expect(collections).toHaveLength(totalNumberOfMods);
        });
    });
    describe('populate mod collection with mod data', () => {
        it('should have the same number of mods in the mod collection as the total number of mods', async () => {
            await databaseService.createDatabase();
            await databaseService.createModsCollection();
            await databaseService.populateModCollectionWithModData();
            const mods = await databaseService.client.db(testDatabaseName).collection(modsCollectionName).find().toArray();
            expect(mods).toHaveLength(totalNumberOfMods);
        });
    });
    describe('populate mod collection with combinations', () => {
        it('should insert the correct number of combinations for each mod', async () => {
            await databaseService.createDatabase();
            await databaseService.createModsCollection();
            await databaseService.populateModCollectionWithModData();
            await databaseService.createModCollections();
            await databaseService.populateModCollectionWithCombinations(testMod, testUnprocessedCombinations);
            expect((await databaseService.client.db(testDatabaseName).collection(testModCollectionName).find().toArray())).toHaveLength(testUnprocessedCombinations.length);
        });
        it('should populate with combinations that match the desired output', async () => {
            await databaseService.createDatabase();
            await databaseService.createModsCollection();
            await databaseService.populateModCollectionWithModData();
            await databaseService.createModCollections();
            await databaseService.populateModCollectionWithCombinations(testModSchema, testUnprocessedCombinations);
            const combinations = await databaseService.client.db(testDatabaseName).collection(testModCollectionName).find().project({_id: 0}).toArray();
            expect(combinations).toEqual(testProcessedCombinations);
        });
    });
    describe('get property value', () => {
        it('should return the correct value for armour', () => {
            const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[0], ['attributes', 'armour', 1]);
            expect(propertyValue).toEqual(0.3999999761581421);
        });
        it('should return the correct value for composition', () => {
            const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[2], ['composition', 4]);
            expect(propertyValue).toEqual(2);
        });
    });
});