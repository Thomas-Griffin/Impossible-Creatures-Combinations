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
        return await this.db.collection(this.collectionName).find({}).project({'_id': 0}).toArray();
    }

    async getMod(id) {
        await this.connect();
        return await this.db.collection(this.collectionName).findOne({_id: id}).project({'_id': 0});
    }


    async getModsByName(name) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({name: name}, {'_id': 0}).toArray();
    }

    async getModByVersion(version) {
        await this.connect();
        return await this.db.collection(this.collectionName).findOne({version: version}).project({'_id': 0});
    }
}

module.exports = ModService;