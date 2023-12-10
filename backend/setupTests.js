const { MongoClient } = require('mongodb')
const { MOD_DIRECTORY } = require('./globalConstants')
const fs = require('fs')
process.env['MONGO_URI'] = 'mongodb://localhost:27017'
process.env['MONGO_DB_NAME'] = 'combinations-test'

const prepareTestEnvironment = async () => {
  if (fs.existsSync(MOD_DIRECTORY)) {
    fs.rmSync(MOD_DIRECTORY, { recursive: true })
  }
  return await MongoClient.connect(process.env['MONGO_URI'])
    .then(client => client.db(process.env['MONGO_DB_NAME']))
    .then(db => db.dropDatabase())
    .catch(err => console.error(err))
}

beforeAll(async () => await prepareTestEnvironment)
afterAll(async () => await prepareTestEnvironment)
