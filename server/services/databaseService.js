const MongoService = require('./mongoService')
const fs = require("fs");

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
            await this.db.createCollection('mods');
            this.schema.forEach(mod => {
                this.db.createCollection(`${mod.name} ${mod.version}`);
            });
            console.log(`Collections created.`);
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
        fs.readFile('services/schema.json', 'utf8', (err, jsonString) => {
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
            fs.mkdir(`mods/${mod.name}/${mod.version}`, {recursive: true}, (err) => {
                if (err) throw err;
            });
            this.createModFile(mod)
        }
    }

    createModFile(mod) {
        let combinations = JSON.stringify(this.fetchCombinations(mod))
        if (!fs.existsSync(`mods/${mod.name}/${mod.version}/combinations.json`)) {
            fs.mkdirSync(`mods/${mod.name}/${mod.version}`, {recursive: true});
            fs.writeFileSync(`mods/${mod.name}/${mod.version}/combinations.json`, combinations, (err) => {
                if (err) throw err;
            });
        } else {
            fs.access(`mods/${mod.name}/${mod.version}/combinations.json`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    console.error(`no access to mod file: mods/${mod.name}/${mod.version}/combinations.json`)
                } else {
                    fs.writeFileSync(`mods/${mod.name}/${mod.version}/combinations.json`, combinations, (err) => {
                        if (err) throw err;
                    });
                }
            })
        }
    }

    fetchCombinations(mod) {
        console.log('fetching all combinations for mod: ' + mod.name + ' ' + mod.version)
        //TODO Get all combinations from combiner and replace these lines
        if (mod.name === 'Tellurian' && mod.version === '2.10') {
            return JSON.parse(fs.readFileSync(`all_combos_Tel2.10_Full.json`, 'utf8'))
        }
        return [];
    }

    loadCombinations(mod) {
        return JSON.parse(fs.readFileSync(`mods/${mod.name}/${mod.version}/combinations.json`, 'utf8'));
    }

    getPropertyValue(data, path) {
        return path.reduce((obj, prop) => obj && obj[prop], data);
    }

    getAnimalNameLimbBelongsTo(combination, limbIndex) {
        if (limbIndex === 1) {
            return this.snakeToTitle(combination["stock_1"])
        } else if (limbIndex === 2) {
            return this.snakeToTitle(combination["stock_2"])
        } else if (limbIndex === -1) {
            return "Inherent"
        } else
            return "None"
    }

    async populateCombinationCollection(mod) {
        let combinations = this.loadCombinations(mod);
        let processedCombinations = [];
        combinations.forEach(combination => {
            let processedCombination = {};
            mod.columns.forEach(column => {
                let propertyValue = this.getPropertyValue(combination, column.path)
                if (column.type === 'string' && column.format === true) {
                    if (column.path.includes('composition')) {
                        propertyValue = this.getAnimalNameLimbBelongsTo(combination, propertyValue)
                    }
                    propertyValue = this.snakeToTitle(propertyValue)
                } else if (column.type === 'float' && column?.decimal_places !== undefined) {
                    if (propertyValue === undefined) {
                        propertyValue = -1
                    } else {
                        propertyValue = parseFloat(this.roundToDecimal(propertyValue, column.decimal_places))
                    }
                }
                processedCombination[column.label] = propertyValue;
            })
            processedCombinations.push(processedCombination)
        })
        if (processedCombinations.length > 0) {
            await this.db.collection(`${mod.name} ${mod.version}`).insertMany(processedCombinations)
            console.log(`Inserted ${processedCombinations.length} combinations for ${mod.name} ${mod.version}`)
        } else {
            console.log(`No combinations found for ${mod.name} ${mod.version}`)
        }
    }

    snakeToTitle(str) {
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
        this.db.collection('mods').insertOne(modData);
    }

    async populateCollections() {
        this.schema.forEach(mod => {
            this.populateModCollection(mod)
            this.populateCombinationCollection(mod);
        })
    }

    deleteModDirectories() {
        if (fs.existsSync('mods')) {
            fs.rmSync('mods', {recursive: true});
        }
    }


    async initialize() {
        this.createModDirectories()
        await this.createDatabase();
        await this.createCollections();
        await this.populateCollections();
        this.deleteModDirectories()
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