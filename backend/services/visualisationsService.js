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
                const result = await this.db.collection(this.toCollectionName(body.mod)).aggregate([
                    {
                        $project: {
                            "Research Level": 1,
                            Animals: ["$Animal 1", "$Animal 2"]
                        }
                    },
                    {
                        $unwind: "$Animals"
                    },
                    {
                        $group: {
                            _id: {
                                Animal: "$Animals",
                                ResearchLevel: {
                                    $cond: [
                                        { $eq: ["$Research Level", null] },
                                        "Unknown",
                                        { $toString: "$Research Level" }
                                    ]
                                }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            animal: "$_id.Animal",
                            researchLevel: { $concat: ["Research Level ", "$_id.ResearchLevel"] },
                            count: "$count"
                        }
                    },
                    {
                        $group: {
                            _id: "$animal",
                            counts: {
                                $push: {
                                    k: "$researchLevel",
                                    v: "$count"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            animal: "$_id",
                            counts: { $arrayToObject: "$counts" }
                        }
                    },
                    {
                        $sort: { "animal": 1 }
                    }
                ]).toArray();
                result.forEach(doc => {
                    if (doc.counts) {
                        if (doc.counts["Research Level 1"] === undefined) {
                            doc.counts["Research Level 1"] = 0;
                        }
                        if (doc.counts["Research Level 2"] === undefined) {
                            doc.counts["Research Level 2"] = 0;
                        }
                        if (doc.counts["Research Level 3"] === undefined) {
                            doc.counts["Research Level 3"] = 0;
                        }
                        if (doc.counts["Research Level 4"] === undefined) {
                            doc.counts["Research Level 4"] = 0;
                        }
                        if (doc.counts["Research Level 5"] === undefined) {
                            doc.counts["Research Level 5"] = 0;
                        }
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