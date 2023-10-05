const MongoService = require('./mongoService')
const fs = require("fs");
const path = require('path');

const MOD_COLLECTION = 'mods';
const MOD_DIRECTORY = 'mods';
const SCHEMA_FILE_NAME = 'schema.json';
const ABILITIES_FILE_NAME = 'abilities.json';
const SCHEMA_FILE_PATH = path.resolve(`./services/${SCHEMA_FILE_NAME}`);
const ABILITIES_FILE_PATH = path.resolve(`./services/${ABILITIES_FILE_NAME}`);
const COMBINATIONS_DIRECTORY = path.resolve('./database/combinations');

const abilitiesMap = JSON.parse(fs.readFileSync(ABILITIES_FILE_PATH, 'utf8'));

class DatabaseService extends MongoService {

    constructor() {
        super();
        this.getSchema()
    }

    async connect() {
        await super.connect();
    }


    async createDatabase() {
        try {
            this.db = this.client.db(this.mongoDbName);
            console.log(`Database '${this.mongoDbName}' was created.`);
        } catch (err) {
            console.error(err);
        }
    }

    async createCollections() {
        try {
            await this.db.createCollection(MOD_COLLECTION);
            this.schema.forEach(mod => {
                this.db.createCollection(`${mod.name} ${mod.version}`);
                console.log(`Collection '${mod.name} ${mod.version}' was created.`)
            });
            console.log(`All collections were created.`);
        } catch (err) {
            console.error(err);
        }
    }

    async deleteDatabase() {
        try {
            await this.connect();
            await this.db.dropDatabase();
            console.log(`All collections and indexes in ${this.mongoDbName} database have been deleted.`);
        } catch (error) {
            console.error('Error deleting database contents', error);
        }
    }

    getSchema() {
        fs.readFile(SCHEMA_FILE_PATH, 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error reading file:', err);
                return null;
            }
            try {
                this.schema = JSON.parse(jsonString);
            } catch (err) {
                console.log('Error parsing JSON:', err);
            }
        });
    }

    createModDirectories() {
        for (const mod of this.schema) {
            fs.mkdir(`${MOD_DIRECTORY}/${mod.name}/${mod.version}`, {recursive: true}, (err) => {
                if (err) throw err;
            });
            this.createModFile(mod)
        }
    }

    createModFile(mod) {
        let combinations = JSON.stringify(this.fetchUnprocessedCombinations(mod))
        if (!fs.existsSync(`${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`)) {
            fs.mkdirSync(`${MOD_DIRECTORY}/${mod.name}/${mod.version}`, {recursive: true});
            fs.writeFileSync(`${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`, combinations, (err) => {
                if (err) throw err;
            });
        } else {
            fs.access(`${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    console.error(`no access to mod file: ${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`)
                } else {
                    fs.writeFileSync(`${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`, combinations, (err) => {
                        if (err) throw err;
                    });
                }
            })
        }
    }

    fetchUnprocessedCombinations(mod) {
        console.log('fetching all combinations for mod: ' + mod.name + ' ' + mod.version)
        return JSON.parse(fs.readFileSync(`${COMBINATIONS_DIRECTORY}/${mod.name} ${mod.version}.json`, 'utf8'));
    }

    loadProcessedCombinations(mod) {
        return JSON.parse(fs.readFileSync(`${MOD_DIRECTORY}/${mod.name}/${mod.version}/combinations.json`, 'utf8'));
    }

    getPropertyValue(combination, path) {
        return path.reduce((obj, prop) => obj && obj[prop], combination);
    }

    getAnimalNameLimbBelongsTo(combination, limbIndex) {
        if (limbIndex === 1) {
            return this.snakeCaseToTitleCase(combination["stock_1"])
        } else if (limbIndex === 2) {
            return this.snakeCaseToTitleCase(combination["stock_2"])
        } else if (limbIndex === -1) {
            return "Inherent"
        } else
            return "None"
    }

    async populateCombinationCollection(mod) {
        let combinations = this.loadProcessedCombinations(mod);
        let totalProcessed = 0;
        for (const combination of combinations) {
            let processedCombination = {};
            let propertyValue;
            mod.columns.forEach(column => {
                if (column?.path !== undefined) {
                    propertyValue = this.getPropertyValue(combination, column.path)
                    if (column.type === 'string' && column.format === true) {
                        if (column.path.includes('composition')) {
                            propertyValue = this.getAnimalNameLimbBelongsTo(combination, propertyValue)
                        }
                        propertyValue = this.snakeCaseToTitleCase(propertyValue)
                    } else if (column.type === 'float' && column?.decimal_places !== undefined) {
                        if (propertyValue === undefined) {
                            propertyValue = 0
                        } else {
                            propertyValue = parseFloat(this.roundToDecimal(propertyValue, column?.decimal_places))
                        }
                    } else if (column.type === 'percentage' && column?.decimal_places !== undefined) {
                        if (propertyValue === undefined) {
                            propertyValue = 0
                        } else {
                            propertyValue = parseFloat(this.roundToDecimal(propertyValue * 100, column?.decimal_places))
                        }
                    }
                    processedCombination[column.label] = propertyValue;
                }
            })
            if (processedCombination?.EHP === null || processedCombination?.EHP === undefined) {
                processedCombination.EHP = this.calculateEHP(processedCombination)
            }

            processedCombination.Abilities = this.getAbilities(combination)

            await this.db.collection(`${mod.name} ${mod.version}`).insertOne(processedCombination)
            totalProcessed += 1;
        }
        console.log(`Processed ${totalProcessed} combinations for mod: ${mod.name} ${mod.version}`)
    }

    getBodyPart(index) {
        if (index - 2 < 0) {
            return "Innate"
        }
        switch (index) {
            case 0:
                return "Front Legs"
            case 1:
                return "Rear Legs"
            case 2:
                return "Head"
            case 3:
                return "Tail"
            case 4:
                return "Torso"
            case 5:
                return "Pincers"
            case 6:
                return "Wings"
            default:
                return "None"
        }
    }

    getAbilities(combination) {
        let abilities = Object.entries(abilitiesMap).map((entry) => {
            let ability = entry[0]
            let label = entry[1]
            if (combination?.attributes[ability] !== undefined && combination?.attributes[ability] !== null) {
                return {ability: label, source: this.getBodyPart(combination.attributes[ability][0])}
            }
        })
        return abilities.filter(ability => ability !== undefined && ability !== null)
    }


    calculateEHP(combination) {
        if (combination?.Health && combination?.Defence) {
            return this.roundToDecimal(combination.Health / (1 - (combination.Defence / 100)), 1)
        }
    }

    snakeCaseToTitleCase(str) {
        return str.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
    }

    roundToDecimal(num, decimalPlaces) {
        const factor = 10 ** decimalPlaces;
        const roundedNum = Math.round(num * factor) / factor;
        if (Math.trunc(roundedNum) === roundedNum) {
            return roundedNum.toString();
        } else {
            return roundedNum.toFixed(decimalPlaces);
        }
    }

    async populateModCollection(mod) {
        let modData = {
            name: mod.name, version: mod.version, columns: mod.columns.map(column => {
                return {label: column.label, type: column.type}
            })
        };
        this.db.collection(MOD_COLLECTION).insertOne(modData);
    }

    async populateCollections() {
        this.schema.forEach(mod => {
            console.log(`populating collections for mod: ${mod.name} ${mod.version}`)
            this.populateModCollection(mod)
            this.populateCombinationCollection(mod);
        })
        console.log('All collections populated.')
    }

    deleteModDirectories() {
        if (fs.existsSync(`${MOD_DIRECTORY}`)) {
            fs.rmSync(`${MOD_DIRECTORY}`, {recursive: true});
        }
    }


    async initialize() {
        await this.acquireMissingJSONCombinationFiles();
        this.createModDirectories()
        await this.createDatabase();
        await this.createCollections();
        await this.populateCollections();
        this.deleteModDirectories()
    }


    async acquireMissingJSONCombinationFiles() {
        let jsonFilesExist = true;
        for (const mod of this.schema) {
            if (!fs.existsSync(`${COMBINATIONS_DIRECTORY}/${mod.name} ${mod.version}.json`)) {
                jsonFilesExist = false;
            }
        }
        if (!jsonFilesExist) {
            console.log(`Combinations files are missing.`)
            console.log('Running cleanup script...')
            require(`${COMBINATIONS_DIRECTORY}/cleanup`)
            console.log('Extracting combinations from compressed files...')
            require(`${COMBINATIONS_DIRECTORY}/decompressor`)
        }
    }

    async resetDatabase() {
        try {
            await this.deleteDatabase();
            await this.initialize();
            return {message: "The Database was reset."};
        } catch (err) {
            console.error(err);
            return {message: "The Database could not be reset.", error: err};
        }
    }
}

module.exports = DatabaseService;