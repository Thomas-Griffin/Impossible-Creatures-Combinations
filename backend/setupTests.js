import { MongoClient } from 'mongodb'

const deleteTestDatabase = async () => {
  await MongoClient.connect(process.env['MONGO_URI'])
    .then(client => client.db(process.env['MONGO_DB_NAME']))
    .then(db => db.dropDatabase())
    .then(() => MongoClient.connect(process.env['MONGO_URI']))
    .then(client => client.close())
    .catch(err => console.error(err))
}

beforeAll(deleteTestDatabase)
afterAll(deleteTestDatabase)
