const MongoService = require('./mongoService')

class ModService extends MongoService {
    constructor() {
        super();
        this.collectionName = process.env.NODE_ENV === 'test' ? 'mods_test' : 'mods';
    }

    async connect() {
        await super.connect();
    }

    async getMods() {
        await this.connect();
        let mods = await this.db.collection(this.collectionName).find({}).project({'_id': 0}).toArray();
        return !mods ? [] : mods;
    }

    async getModsByName(name) {
        await this.connect();
        let mods = await this.db.collection(this.collectionName).find({name: name}, {'_id': 0}).toArray();
        return !mods ? [] : mods;
    }

}

module.exports = ModService;