const MongoService = require('./mongoService')
const defaultModName = 'Tellurian 2.10'

class CombinationsService extends MongoService {
    constructor() {
        super();
        if (process.env.NODE_ENV === 'test') {
            this.collectionName = 'combinations_test';
        } else {
            this.collectionName = defaultModName;
        }
    }

    async connect() {
        await super.connect();
    }

    setMod(mod) {
        if (mod.name && mod.version) {
            this.collectionName = `${mod.name} ${mod.version}`;
            return {status: 200, body: "Mod set to " + this.collectionName};
        } else {
            return {status: 500, body: 'Mod name and version are required'};
        }
    }

    async getTotalCombinations() {
        await this.connect();
        return await this.db.collection(this.collectionName).countDocuments();
    }


    async getTotalCombinationsWithFilters(body) {
        await this.connect();
        const query = this.buildFiltersQuery(body);
        return await this.db.collection(this.collectionName).countDocuments(query)
    }

    async getCombinations(pageNumber = 1, nPerPage = Number.MAX_SAFE_INTEGER) {
        await this.connect();
        return await this.db.collection(this.collectionName).find()
            .project({'_id': 0})
            .skip((pageNumber - 1) * nPerPage)
            .limit(nPerPage)
            .toArray();
    }

    async getCombination(id) {
        await this.connect();
        return await this.db.collection(this.collectionName).findOne({_id: id}).project({'_id': 0});
    }

    async getCombinationsByAnimal1(name) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Animal 1": name}).project({'_id': 0}).toArray();
    }

    async getCombinationsByAnimal2(name) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Animal 2": name}).project({'_id': 0}).toArray();
    }

    async getCombinationsByResearchLevel(level) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Research Level": level}).project({'_id': 0}).toArray();
    }

    async getCombinationsByPower(power) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Power": power}).project({'_id': 0}).toArray();
    }

    async getCombinationsByAirSpeed(airSpeed) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Air Speed": airSpeed}).project({'_id': 0}).toArray();
    }

    async getCombinationsByLandSpeed(landSpeed) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Land Speed": landSpeed}).project({'_id': 0}).toArray();
    }

    async getCombinationsByWaterSpeed(waterSpeed) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Water Speed": waterSpeed}).project({'_id': 0}).toArray();
    }

    async getCombinationsByHealth(health) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Health": health}).project({'_id': 0}).toArray();
    }

    async getCombinationsBySize(size) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Size": size}).project({'_id': 0}).toArray();
    }

    async getCombinationsByPopulationCost(populationCost) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Population Cost": populationCost}).project({'_id': 0}).toArray();
    }

    async getCombinationsByEHP(EHP) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"EHP": EHP}).project({'_id': 0}).toArray();
    }

    async getCombinationsByMeleeDamage(meleeDamage) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Melee Damage": meleeDamage}).project({'_id': 0}).toArray();
    }

    async getCombinationsBySightRadius(sightRadius) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Sight Radius": sightRadius}).project({'_id': 0}).toArray();
    }

    async getCombinationsByFrontLegs(frontLegs) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Front Legs": frontLegs}).project({'_id': 0}).toArray();
    }

    async getCombinationsByRearLegs(rearLegs) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Rear Legs": rearLegs}).project({'_id': 0}).toArray();
    }

    async getCombinationsByHead(head) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Head": head}).project({'_id': 0}).toArray();
    }


    async getCombinationsByTail(tail) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Tail": tail}).project({'_id': 0}).toArray();
    }

    async getCombinationsByTorso(torso) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Torso": torso}).project({'_id': 0}).toArray();
    }

    async getCombinationsByPincers(pincers) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Pincers": pincers}).project({'_id': 0}).toArray();
    }

    async getCombinationsByWings(wings) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({"Wings": wings}).project({'_id': 0}).toArray();
    }

    async getCombinationsInRange(attribute = "", min = 0, max = Number.MAX_SAFE_INTEGER, pageNumber = 1, nPerPage = Number.MAX_SAFE_INTEGER) {
        await this.connect();
        return await this.db.collection(this.collectionName).find({[attribute]: {$gte: min, $lte: max}})
            .project({'_id': 0})
            .skip((pageNumber - 1) * nPerPage)
            .limit(nPerPage)
            .toArray();
    }

    async getCombinationsWithFiltersAndSorting(body = {
        filters: [],
        sorting: {column: "Animal 1", order: "descending"}
    }, pageNumber = 1, nPerPage = Number.MAX_SAFE_INTEGER) {
        await this.connect();
        const query = this.buildFiltersQuery(body);
        console.log('query', query);
        return await this.db.collection(this.collectionName).find(query)
            .project({'_id': 0})
            .sort({[body.sorting.column]: body.sorting.order === "descending" ? -1 : 1})
            .skip((pageNumber - 1) * nPerPage)
            .limit(nPerPage)
            .toArray();
    }

    buildFiltersQuery(body) {
        const defaultSorting = {column: "Animal 1", order: "descending"}
        if (body === null) {
            body = {
                filters: [],
                sorting: defaultSorting
            }
        }
        if (body?.filters === null || body?.filters === undefined) {
            body.filters = [];
        }
        if (body?.sorting === null || body?.sorting === undefined) {
            body.sorting = defaultSorting;
        }
        let query = {};
        body.filters.forEach(obj => {
            if (obj !== null && obj.filter !== null) {
                if (obj.filter.min !== null && obj.filter.max !== null && obj.filter.min !== undefined && obj.filter.max !== undefined)
                    query[obj.label] = {$gte: obj.filter.min, $lte: obj.filter.max};
                else {
                    query[obj.label] = {$regex: new RegExp(obj.filter, 'i')};
                }
            }
        });
        return query;
    }

    async getAttributeMinMax(attribute = "") {
        await this.connect();
        return await this.db.collection(this.collectionName).aggregate([
            {$group: {_id: null, min: {$min: `$${attribute}`}, max: {$max: `$${attribute}`}}}
        ]).project({'_id': 0}).toArray();
    }
}


module.exports = CombinationsService;