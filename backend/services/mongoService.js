const {MongoClient} = require('mongodb');

class MongoService {
    constructor() {
        this.db = null;
        this.mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
        this.mongoDbName = process.env.MONGO_DB_NAME || 'combinations';
        this.client = new MongoClient(this.mongoUrl);
    }

    async connect() {
        try {
            await this.client.connect();
            await this.client.db(this.mongoDbName).command({ping: 1});
            this.db = this.client.db(this.mongoDbName);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = MongoService;
