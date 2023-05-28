const Joi = require('joi');
const MongoService = require('./mongoService')
const combinationErrors = require('../errors/combinationsErrors')
const genericErrors = require('../errors/genericErrors')
const fs = require("fs");
let mods = JSON.parse(fs.readFileSync('services/schema.json', 'utf8'));
const testMods = JSON.parse(fs.readFileSync('services/testSchema.json', 'utf8'));
mods = mods.concat(testMods);


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
            return combinationErrors.ModMissingError;
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

    async getCombinations(body, pageNumber, nPerPage) {
        const bodySchema = Joi.object({
            mod: Joi.object({
                name: Joi.string().valid(...mods.map(mod => mod.name)).required(),
                version: Joi.string().valid(...mods.map(mod => mod.version)).required(),
                columns: Joi.array().items(Joi.object()).optional(),
            }),
            filters: Joi.array().items(Joi.object()).optional(),
            sorting: Joi.object({
                column: Joi.string().required().messages({
                    'any.required': 'The "column" field is required in the sorting object',
                    'string.base': 'The "column" field must be a string',
                }),
                order: Joi.string().valid('ascending', 'descending').required().messages({
                    'any.required': 'The "order" field is required in the sorting object',
                    'any.only': 'The "order" field must be either "ascending" or "descending"',
                }),
            }).optional().messages({
                'object.base': 'The "sorting" field must be an object',
            }),
        })
        const {error} = bodySchema.validate(body, {abortEarly: false});
        if (error) {
            return error;
        }
        const pageNumberSchema = Joi.number().strict().integer().min(1).required().label('pageNumber');
        const {error: pageNumberError} = pageNumberSchema.validate(pageNumber);
        if (pageNumberError) {
            return pageNumberError;
        }
        const nPerPageSchema = Joi.number().strict().integer().min(1).required().label('nPerPage');
        const {error: nPerPageError} = nPerPageSchema.validate(nPerPage);
        if (nPerPageError) {
            return nPerPageError;
        }
        if (body?.mod?.name && body?.mod?.version) {
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