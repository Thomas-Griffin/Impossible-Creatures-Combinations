const MongoService = require('./mongoService')
const combinationErrors = require('../errors/combinationsErrors')
const genericErrors = require('../errors/genericErrors')

class CombinationsService extends MongoService {
    constructor() {
        super();
    }

    async connect() {
        await super.connect();
    }

    async getTotalCombinations(body) {
        const mod = body?.mod;
        if (mod === null || mod === undefined) {
            return combinationErrors.ModError;
        }
        if (mod?.name === null || mod?.name === undefined) {
            return combinationErrors.ModNameError;
        }
        if (mod?.version === null || mod?.version === undefined) {
            return combinationErrors.ModVersionError;
        } else if (mod.name && mod.version) {
            await this.connect();
            try {
                const query = this.buildFiltersQuery(body);
                return await this.db.collection(this.toCollectionName(mod)).countDocuments(query);
            } catch (err) {
                console.error(err);
                return genericErrors.InternalServerError;
            }
        }
    }

    async getCombinations(body = {
        mod: {name: "Impossible Creatures", version: "1.1"},
        filters: [], sorting: {column: "Animal 1", order: "descending"}
    }, pageNumber = 1, nPerPage = Number.MAX_SAFE_INTEGER) {
        if (body?.mod === null || body?.mod === undefined) {
            return combinationErrors.ModError;
        }
        if (body?.mod?.name === null || body?.mod?.name === undefined || body?.mod?.name === '') {
            return combinationErrors.ModNameError;
        }
        if (body?.mod?.version === null || body?.mod?.version === undefined || body?.mod?.version === '') {
            return combinationErrors.ModVersionError;
        } else if (body?.mod?.name && body?.mod?.version) {
            try {
                await this.connect();
                const query = this.buildFiltersQuery(body);
                return await this.db.collection(this.toCollectionName(body.mod)).find(query)
                    .project({'_id': 0})
                    .sort({[body.sorting.column]: body.sorting.order === "descending" ? -1 : 1})
                    .skip((pageNumber - 1) * nPerPage)
                    .limit(nPerPage)
                    .toArray();
            } catch (err) {
                console.error(err);
                return {status: 500, body: err};
            }
        }
    }

    async getAttributeMinMax(query = {mod: {name: 'Impossible Creatures', version: '1.1'}, attribute: ''}) {
        if (query?.mod?.name === null || query?.mod?.name === undefined || query?.mod?.name === '') {
            return combinationErrors.ModNameError;
        }
        if (query?.mod?.version === null || query?.mod?.version === undefined || query?.mod?.version === '') {
            return combinationErrors.ModVersionError;
        }
        if (query?.attribute === null || query?.attribute === undefined || query?.attribute === '') {
            return combinationErrors.AttributeNotSuppliedError;
        }
        try {
            await this.connect();
            return await this.db.collection(this.toCollectionName(query.mod)).aggregate([{
                $group: {
                    _id: null,
                    min: {$min: `$${query.attribute}`},
                    max: {$max: `$${query.attribute}`}
                }
            }]).project({'_id': 0}).toArray();
        } catch (err) {
            console.error(err);
            return {status: 500, body: err};
        }
    }

    toCollectionName(mod) {
        return `${mod.name} ${mod.version}`;
    }

    buildFiltersQuery(body) {
        const defaultSorting = {column: "Animal 1", order: "descending"}
        if (body === null) {
            body = {
                filters: [], sorting: defaultSorting
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
                if (obj.filter.min !== null && obj.filter.max !== null && obj.filter.min !== undefined && obj.filter.max !== undefined) query[obj.label] = {
                    $gte: obj.filter.min,
                    $lte: obj.filter.max
                }; else {
                    query[obj.label] = {$regex: new RegExp(obj.filter, 'i')};
                }
            }
        });
        return query;
    }
}


module.exports = CombinationsService;