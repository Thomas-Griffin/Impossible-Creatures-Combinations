import { MongoClient } from 'mongodb'

class MongoService {
  mongoUrl: string
  client: MongoClient

  constructor() {
    if (!process.env['environment']) {
      console.error('Environment not set')
      process.exit(1)
    }

    if (process.env['environment'] === 'production') {
      process.env['MONGO_URI'] = 'mongodb://combinations-database:27017'
    } else {
      process.env['MONGO_URI'] = 'mongodb://localhost:27017'
    }
    process.env['MONGO_DB_NAME'] = `combinations-${process.env['environment']}`
    this.mongoUrl = process.env['MONGO_URI'] || 'mongodb://localhost:27017'
    this.client = new MongoClient(this.mongoUrl)
    this.client.db(process.env['MONGO_DB_NAME'])
  }
}

export default MongoService
