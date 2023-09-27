const Joi = require('joi');
const MongoService = require('./mongoService')
const fs = require("fs");
const {InternalServerError} = require("../errors/genericErrors");
let mods = JSON.parse(fs.readFileSync('services/schema.json', 'utf8'));
const testMods = JSON.parse(fs.readFileSync('services/testSchema.json', 'utf8'));
mods = mods.concat(testMods);


class VisualisationsService extends MongoService {
    constructor() {
        super();
        this.modSchema = Joi.object({
            mod: Joi.object({
                name: Joi.string().valid(...mods.map(mod => mod.name)).required(),
                version: Joi.string().valid(...mods.map(mod => mod.version)).required(),
                columns: Joi.array().items(Joi.object()).optional(),
            }),
        })
    }

    async connect() {
        await super.connect();
    }

    toCollectionName(mod) {
        return `${mod.name} ${mod.version}`;
    }

    sortObjectKeys(obj) {
        const sorted = {};
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = obj[key];
        });
        return sorted;
    }


    async getResearchLevelsPerStock(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                const result = await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $group: {
                        _id: {
                            Animal: {$ifNull: ["$Animal 1", "$Animal 2"]}, ResearchLevel: "$Research Level"
                        }, count: {$sum: 1}
                    }
                }, {
                    $group: {
                        _id: "$_id.Animal", counts: {
                            $push: {
                                k: {$concat: ["Research Level ", {$toString: "$_id.ResearchLevel"}]}, v: "$count"
                            }
                        }
                    }
                }, {
                    $project: {
                        _id: 0, animal: "$_id", counts: {$arrayToObject: "$counts"}
                    }
                }, {
                    $sort: {
                        "animal": 1,
                    }
                }, {
                    $addFields: {
                        "counts": {
                            $arrayToObject: {
                                $map: {
                                    input: {$objectToArray: "$counts"}, in: {
                                        k: "$$this.k", v: "$$this.v"
                                    }
                                }
                            }
                        }
                    }
                }]).toArray();
                result.forEach(doc => {
                    if (doc.counts) {
                        doc.counts = this.sortObjectKeys(doc.counts);
                    }
                });
                return result;
            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }

    async getCoalCostPerStock(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                return await Promise.all(this.db.collection(this.toCollectionName(body.mod)).toArray());
            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }
}


module.exports = VisualisationsService;