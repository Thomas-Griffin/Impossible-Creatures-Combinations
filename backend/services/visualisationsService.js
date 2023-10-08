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
        return `${mod?.name} ${mod?.version}`;
    }

    sortObjectKeys(obj) {
        const sorted = {};
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = obj[key];
        });
        return sorted;
    }

    formatResearchLevels(doc) {
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
        return doc;
    }

    async getResearchLevelsPerStock(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                const result = await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $project: {
                        "Research Level": 1, Animals: ["$Animal 1", "$Animal 2"]
                    }
                }, {
                    $unwind: "$Animals"
                }, {
                    $group: {
                        _id: {
                            Animal: "$Animals", ResearchLevel: {
                                $cond: [{$eq: ["$Research Level", null]}, "Unknown", {$toString: "$Research Level"}]
                            }
                        }, count: {$sum: 1}
                    }
                }, {
                    $project: {
                        _id: 0,
                        animal: "$_id.Animal",
                        researchLevel: {$concat: ["Research Level ", "$_id.ResearchLevel"]},
                        count: "$count"
                    }
                }, {
                    $group: {
                        _id: "$animal", counts: {
                            $push: {
                                k: "$researchLevel", v: "$count"
                            }
                        }
                    }
                }, {
                    $project: {
                        _id: 0, animal: "$_id", counts: {$arrayToObject: "$counts"}
                    }
                }, {
                    $sort: {"animal": 1}
                }]).toArray();
                result.forEach(doc => this.formatResearchLevels(doc));
                return result;
            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }

    async getCoalCostDistribution(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                return await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $bucket: {
                        groupBy: '$Coal', // Field to group by
                        boundaries: Array.from({length: 21}, (_, i) => i * 100), // Intervals from 0 to 2000
                        default: 'Other', // Default bucket name for values outside the defined boundaries
                        output: {
                            count: {$sum: 1}, // Count occurrences within each bucket
                            lowerBound: {$min: '$Coal'}, // Calculate the lower bound for each bucket
                            upperBound: {$max: '$Coal'}, // Calculate the upper bound for each bucket
                        },
                    },
                }, {
                    $project: {
                        _id: 0, // Exclude the "_id" field
                        count: 1, // Include the "count" field
                        bounds: {
                            lower: '$lowerBound', // Include the lower bound in the "bounds" object
                            upper: '$upperBound', // Include the upper bound in the "bounds" object
                        },
                    },
                },]).toArray();
            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }

    async getCoalCostDistributionPerResearchLevel(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                let result = await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $addFields: {
                        coalInterval: {
                            $floor: {$divide: ['$Coal', 100]} // Calculate the interval of 100 for Coal
                        }
                    }
                }, {
                    $group: {
                        _id: {
                            ResearchLevel: '$Research Level', CoalInterval: '$coalInterval'
                        }, count: {$sum: 1}
                    }
                }, {
                    $group: {
                        _id: '$_id.CoalInterval', counts: {
                            $push: {
                                k: {$concat: ['Research Level ', {$toString: '$_id.ResearchLevel'}]}, v: '$count'
                            }
                        }
                    }
                }, {
                    $sort: {
                        '_id': 1 // Sort by CoalInterval in ascending order
                    }
                }, {
                    $project: {
                        _id: 0, bounds: {
                            lower: {$multiply: ['$_id', 100]}, // Calculate the lower bound
                            upper: {$add: [{$multiply: ['$_id', 100]}, 100]} // Calculate the upper bound
                        }, counts: {$arrayToObject: '$counts'} // Convert the counts array to an object
                    }
                }]).toArray();

                result.forEach(doc => this.formatResearchLevels(doc));

                return result;

            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }

    async getElectricityDistribution(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                return await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $bucket: {
                        groupBy: '$Electricity', // Field to group by
                        boundaries: Array.from({length: 21}, (_, i) => i * 100), // Intervals from 0 to 2000
                        default: 'Other', // Default bucket name for values outside the defined boundaries
                        output: {
                            count: {$sum: 1}, // Count occurrences within each bucket
                            lowerBound: {$min: '$Electricity'}, // Calculate the lower bound for each bucket
                            upperBound: {$max: '$Electricity'}, // Calculate the upper bound for each bucket
                        },
                    },
                }, {
                    $project: {
                        _id: 0, // Exclude the "_id" field
                        count: 1, // Include the "count" field
                        bounds: {
                            lower: '$lowerBound', // Include the lower bound in the "bounds" object
                            upper: '$upperBound', // Include the upper bound in the "bounds" object
                        },
                    },
                },]).toArray();
            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }

    async getElectricityDistributionPerResearchLevel(body) {
        const {error} = this.modSchema.validate(body);
        if (error) {
            return error;
        } else {
            await this.connect();
            try {
                let result = await this.db.collection(this.toCollectionName(body.mod)).aggregate([{
                    $addFields: {
                        electricityInterval: {
                            $floor: {$divide: ['$Electricity', 100]} // Calculate the interval of 100 for Electricity
                        }
                    }
                }, {
                    $group: {
                        _id: {
                            ResearchLevel: '$Research Level', ElectricityInterval: '$electricityInterval'
                        }, count: {$sum: 1}
                    }
                }, {
                    $group: {
                        _id: '$_id.ElectricityInterval', counts: {
                            $push: {
                                k: {$concat: ['Research Level ', {$toString: '$_id.ResearchLevel'}]}, v: '$count'
                            }
                        }
                    }
                }, {
                    $sort: {
                        '_id': 1 // Sort by ElectricityInterval in ascending order
                    }
                }, {
                    $project: {
                        _id: 0, bounds: {
                            lower: {$multiply: ['$_id', 100]}, // Calculate the lower bound
                            upper: {$add: [{$multiply: ['$_id', 100]}, 100]} // Calculate the upper bound
                        }, counts: {$arrayToObject: '$counts'} // Convert the counts array to an object
                    }
                }]).toArray();

                result.forEach(doc => this.formatResearchLevels(doc));

                return result;

            } catch (err) {
                console.error(err);
                return InternalServerError;
            }
        }
    }
}

module.exports = VisualisationsService;