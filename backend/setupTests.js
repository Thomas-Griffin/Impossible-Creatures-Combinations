const {MongoMemoryServer} = require('mongodb-memory-server');
const {testDatabaseName} = require('./test/constants/globalTestConstants');
let testMongoDatabase;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    testMongoDatabase = await MongoMemoryServer.create();
    process.env.MONGO_URL = testMongoDatabase.getUri();
    process.env.MONGO_DB_NAME = testDatabaseName;
});

afterAll(async () => {
    await testMongoDatabase.stop();
});