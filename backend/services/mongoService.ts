import { MongoClient } from 'mongodb'

class MongoService {
  mongoUrl: string
  client: MongoClient

  constructor() {
    this.mongoUrl = (process.env['MONGO_URI'] as string) || 'mongodb://localhost:27017'
    this.client = new MongoClient(this.mongoUrl)
    this.client.db(process.env['MONGO_DB_NAME'])
  }
}

export default MongoService
