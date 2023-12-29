const { MongoClient } = require('mongodb')
const { MOD_DIRECTORY_PATH, CLEANUP_SCRIPT_PATH } = require('./globalConstants')
const fs = require('fs')
const cleanupDatabase = require(CLEANUP_SCRIPT_PATH)
process.env['MONGO_URI'] = 'mongodb://localhost:27017'
process.env['MONGO_DB_NAME'] = 'combinations-test'

const prepareTestEnvironment = async () => {
  if (fs.existsSync(MOD_DIRECTORY_PATH)) {
    fs.rmSync(MOD_DIRECTORY_PATH, { recursive: true })
  }
  cleanupDatabase()
  return await MongoClient.connect(process.env['MONGO_URI'])
    .then(client => client.db(process.env['MONGO_DB_NAME']))
    .then(db => db.dropDatabase())
    .catch(err => console.error(err))
}

beforeAll(async () => await prepareTestEnvironment)
afterAll(async () => await prepareTestEnvironment)
