import {access, constants, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'fs';
import MongoService from './mongoService';
import Mod from '../types/Mod';
import UnprocessedCombination from '../types/UnprocessedCombination';
import ProcessedCombination from '../types/ProcessedCombination';
import {ModSchema} from '../types/ModSchema';
import Ability from '../types/Ability';
import Logger from '../utility/logger';
import {
    ABILITIES_FILE_PATH,
    CLEANUP_SCRIPT_PATH,
    COMBINATIONS_DIRECTORY_PATH,
    DECOMPRESSOR_SCRIPT_PATH,
    MOD_COLLECTION_NAME,
    MOD_DIRECTORY_PATH,
} from '../globalConstants';
import {modCombinationTotals} from '../test/constants/globalTestConstants';
import schemas from '../database/modSchemas';
import {MongoClient} from 'mongodb';

const logger = Logger.getInstance();

const abilitiesMap: Record<string, string> = JSON.parse(readFileSync(ABILITIES_FILE_PATH, 'utf8'));

class DatabaseService {
    schema: ModSchema[] = [];
    client: MongoClient;

    constructor(mongoService: MongoService) {
        this.client = mongoService.client;
        this.getSchema();
    }

    async createDatabase() {
        try {
            await this.client.connect();
            this.client.db(process.env['MONGO_DB_NAME']);
            logger.info(`Database '${process.env['MONGO_DB_NAME']}' was created.`);
        } catch (err) {
            logger.error(err);
        }
    }

    async createModsCollection() {
        try {
            await this.client.connect();
            await this.client.db(process.env['MONGO_DB_NAME']).createCollection(MOD_COLLECTION_NAME);
            logger.info(`Mod collection '${MOD_COLLECTION_NAME}' was created.`);
        } catch (err) {
            logger.error(err);
        }
    }

    async createModCollections() {
        try {
            await this.client.connect();
            for (const mod of this.schema) {
                await this.client.db(process.env['MONGO_DB_NAME']).createCollection(`${mod.name} ${mod.version}`);
                logger.info(`Mod collection '${mod.name} ${mod.version}' was created.`);
            }
            logger.info(`All mod collections were created.`);
        } catch (err) {
            logger.error(err);
        }
    }

    async databaseExists(databaseName: string | undefined) {
        if (databaseName === undefined) {
            return false;
        }
        try {
            await this.client.connect();
            const adminDb = this.client.db('admin');
            const result = await adminDb.admin().listDatabases();
            const databases = result.databases.map(db => db.name);
            return databases.includes(databaseName);
        } finally {
            await this.client.close();
        }
    }

    async deleteDatabase() {
        logger.info(`Deleting database '${process.env['MONGO_DB_NAME']}'...`);
        try {
            await this.client.connect();
            if (await this.databaseExists(process.env['MONGO_DB_NAME'] ?? '')) {
                await this.client.connect();
                await this.client.db(process.env['MONGO_DB_NAME']).dropDatabase();
                logger.info(
                    `All collections and indexes in ${process.env['MONGO_DB_NAME']} database have been deleted.`
                );
            } else {
                logger.info(`Database '${process.env['MONGO_DB_NAME']}' does not exist.`);
            }
        } catch (error) {
            logger.error('Error deleting database contents', error);
        }
    }

    getSchema() {
        this.schema = schemas;
    }

    createModDirectories() {
        for (const mod of this.schema) {
            mkdirSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}`, {recursive: true});
        }
    }

    createModFiles() {
        for (const mod of this.schema) {
            this.createModFile(mod as Mod);
        }
    }

    createModFile(mod: Mod) {
        let combinations = JSON.stringify(this.fetchUnprocessedCombinations(mod));
        if (existsSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`)) {
            access(
                `${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`,
                constants.R_OK | constants.W_OK,
                err => {
                    if (err) {
                        logger.error(
                            `no access to mod file: ${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`
                        );
                    } else {
                        writeFileSync(
                            `${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`,
                            combinations
                        );
                    }
                }
            );
        } else {
            mkdirSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}`, {recursive: true});
            writeFileSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`, combinations);
        }
    }

    fetchUnprocessedCombinations(mod: Mod) {
        logger.info(`fetching all combinations for mod: ${mod.name} ${mod.version}`);
        try {
            return JSON.parse(readFileSync(`${COMBINATIONS_DIRECTORY_PATH}/${mod.name} ${mod.version}.json`, 'utf8'));
        } catch (err) {
            logger.error(err);
        }
    }

    loadCombinations(mod: Mod) {
        try {
            return JSON.parse(
                readFileSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}/combinations.json`, 'utf8')
            );
        } catch (err) {
            logger.error(err);
        }
    }

    getPropertyValue(combination: UnprocessedCombination | undefined, path: any[]): string | number | undefined {
        return path.reduce((obj, prop) => obj && obj[prop], combination);
    }

    getAnimalNameLimbBelongsTo(combination: UnprocessedCombination, limbIndex: number) {
        return limbIndex === 1
            ? this.snakeCaseToTitleCase(combination['stock_1'])
            : limbIndex === 2
              ? this.snakeCaseToTitleCase(combination['stock_2'])
              : limbIndex === -1
                ? 'Inherent'
                : 'None';
    }

    async populateModCollection(modSchema: ModSchema, combinations: UnprocessedCombination[] | null = null) {
        if (!combinations) {
            combinations = this.loadCombinations(modSchema as Mod);
        }
        if (combinations === null) {
            logger.error('No combinations were found for mod: ' + modSchema.name + ' ' + modSchema.version);
            return;
        }
        let processedCombinations: ProcessedCombination[] = [];
        for (const combination of combinations) {
            let processedCombination: ProcessedCombination = {
                Abilities: [] as Ability[],
                'Air Speed': this.roundToDecimal(combination.attributes.airspeed_val?.[1] || 0, 1),
                'Animal 1': this.snakeCaseToTitleCase(combination.stock_1),
                'Animal 2': this.snakeCaseToTitleCase(combination.stock_2),
                Coal: this.roundToDecimal(combination.attributes.cost?.[1] || 0, 1),
                Defence: this.roundToDecimal((combination.attributes.armour?.[1] || 0) * 100, 1),
                EHP: 0,
                Electricity: this.roundToDecimal(combination.attributes.costrenew?.[1] || 0, 1),
                'Front Legs': this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[0] || 0),
                Head: this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[2] || 0),
                Health: this.roundToDecimal(combination.attributes.health_val?.[1] || 0, 1),
                'Land Speed': this.roundToDecimal(combination.attributes.landspeed_val?.[1] || 0, 1),
                'Melee Damage': this.roundToDecimal(combination.attributes.damage_val?.[1] || 0, 1),
                Pincers: this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[5] || 0),
                'Population Size': combination.attributes.popsize?.[1] || 0,
                Power: this.roundToDecimal(combination.attributes?.Power?.[1] || 0, 1),
                'Rear Legs': this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[1] || 0),
                'Research Level': combination.attributes.creature_rank?.[1] || 0,
                SDT: 0,
                'Sight Radius': this.roundToDecimal(combination.attributes.sight_radius1?.[1] || 0, 1),
                Size: this.roundToDecimal(combination.attributes.size?.[1] || 0, 1),
                Tail: this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[3] || 0),
                Torso: this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[4] || 0),
                'Water Speed': this.roundToDecimal(combination.attributes.waterspeed_val?.[1] || 0, 1),
                Wings: this.getAnimalNameLimbBelongsTo(combination, combination.composition?.[6] || 0),
            };
            processedCombination.EHP = this.calculateEHP(processedCombination);
            processedCombination.SDT = this.calculateSelfDestructionTime(processedCombination);
            processedCombination.Abilities = this.getAbilities(combination);
            processedCombinations.push(processedCombination);
        }
        await this.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(`${modSchema.name} ${modSchema.version}`)
            .insertMany(processedCombinations);
        logger.info(
            `Collection '${modSchema.name} ${modSchema.version}' was populated with ${processedCombinations.length} documents.`
        );
    }

    getBodyPart(index: number): string {
        if (index - 2 < 0) {
            return 'Innate';
        }
        switch (index) {
            case 0:
                return 'Front Legs';
            case 1:
                return 'Rear Legs';
            case 2:
                return 'Head';
            case 3:
                return 'Tail';
            case 4:
                return 'Torso';
            case 5:
                return 'Pincers';
            case 6:
                return 'Wings';
            default:
                return 'None';
        }
    }

    getAbilities(combination: UnprocessedCombination): Ability[] {
        let abilities = Object.entries(abilitiesMap).map(entry => {
            let ability = entry[0];
            let label = entry[1];
            let limbIndex = combination.attributes[ability]?.[0];
            if (limbIndex === undefined) {
                return undefined;
            } else {
                return {
                    ability: label,
                    source: this.getBodyPart(limbIndex),
                };
            }
        });
        return abilities.filter(ability => ability !== undefined) as Ability[];
    }

    calculateEHP(combination: ProcessedCombination) {
        if (combination?.Health && combination?.Defence) {
            return this.roundToDecimal(combination.Health / (1 - combination.Defence / 100), 1);
        } else {
            return -0;
        }
    }

    calculateSelfDestructionTime(processedCombination: ProcessedCombination) {
        if (processedCombination?.['Melee Damage'] === undefined || processedCombination?.EHP === undefined) {
            return 0;
        }
        return this.roundToDecimal(processedCombination.EHP / processedCombination['Melee Damage'], 1);
    }

    snakeCaseToTitleCase(property: string) {
        return property.replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase());
    }

    roundToDecimal(num: number, decimalPlaces: number = 1): number {
        const factor = 10 ** decimalPlaces;
        const roundedNum = Math.round(num * factor) / factor;
        if (Math.trunc(roundedNum) === roundedNum) {
            return roundedNum;
        } else {
            return parseFloat(roundedNum.toFixed(decimalPlaces));
        }
    }

    async populateModCollectionWithModData() {
        for (const mod of this.schema) {
            logger.info(`Populating collection for mod: ${mod.name} ${mod.version} with mod data`);
            let modData = {
                name: mod.name,
                version: mod.version,
                columns: mod.columns.map(column => {
                    return {label: column.label, type: column.type};
                }),
            };
            await this.client.db(process.env['MONGO_DB_NAME']).collection(MOD_COLLECTION_NAME).insertOne(modData);
        }
    }

    async populateModCollectionsWithCombinations() {
        for (const mod of this.schema) {
            logger.info(`Populating collection for mod: ${mod.name} ${mod.version} with combinations`);
            await this.populateModCollection(mod);
        }
    }

    deleteModDirectories() {
        if (existsSync(`${MOD_DIRECTORY_PATH}`)) {
            rmSync(`${MOD_DIRECTORY_PATH}`, {recursive: true});
        }
    }

    async initialise() {
        await this.acquireMissingJSONCombinationFiles();
        this.createModDirectories();
        this.createModFiles();
        await this.createDatabase();
        await this.createModsCollection();
        await this.createModCollections();
        await this.populateModCollectionWithModData();
        await this.populateModCollectionsWithCombinations();
        await this.setModColumnMinMaxes();
        this.deleteModDirectories();
    }

    async acquireMissingJSONCombinationFiles() {
        let jsonFilesExist = true;
        for (const mod of this.schema) {
            if (!existsSync(`${COMBINATIONS_DIRECTORY_PATH}/${mod.name} ${mod.version}.json`)) {
                jsonFilesExist = false;
            }
        }
        if (!jsonFilesExist) {
            logger.info(`Combinations files are missing.`);
            try {
                logger.info('Running cleanup script...');
                const cleanupModule = await import(CLEANUP_SCRIPT_PATH);
                await cleanupModule.default();
                logger.info('Extracting combinations from compressed files...');
                const decompressorModule = await import(DECOMPRESSOR_SCRIPT_PATH);
                await decompressorModule.default();
            } catch (err) {
                logger.error(err);
                throw err;
            }
        }
    }

    async resetDatabase() {
        let errors = null;
        logger.info(`Resetting database '${process.env['MONGO_DB_NAME']}'...`);
        if (existsSync(MOD_DIRECTORY_PATH)) {
            logger.info(`Directory '${MOD_DIRECTORY_PATH}' exists.`);
            logger.info(`Deleting directory '${MOD_DIRECTORY_PATH}'...`);
            rmSync(MOD_DIRECTORY_PATH, {recursive: true});
        } else {
            logger.info(`Directory '${MOD_DIRECTORY_PATH}' does not already exist.`);
        }
        try {
            await this.deleteDatabase();
            await this.initialise();
        } catch (err) {
            errors = err;
            logger.error(errors);
        }
        if (errors) {
            return {message: 'The Database could not be reset.', error: errors};
        } else {
            return {message: 'The Database was reset successfully.'};
        }
    }

    async databaseIsInitialised() {
        logger.info(`Checking if database '${process.env['MONGO_DB_NAME']}' is initialised...`);
        let initialised = true;
        for (const mod of this.schema) {
            const documentCount = await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(`${mod.name} ${mod.version}`)
                .countDocuments();
            const expectedDocumentCount = modCombinationTotals.find(
                modCombinationTotal =>
                    modCombinationTotal.name === mod.name && modCombinationTotal.version === mod.version
            )?.total;
            const foundMod = await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .findOne({
                    name: mod.name,
                    version: mod.version,
                });
            if (documentCount !== expectedDocumentCount || foundMod === null) {
                initialised = false;
            }
        }
        if (initialised) {
            logger.info(`Database '${process.env['MONGO_DB_NAME']}' is initialised.`);
        } else {
            logger.info(`Database '${process.env['MONGO_DB_NAME']}' is not initialised.`);
        }
        return initialised;
    }

    async setModColumnMinMaxes() {
        logger.info(`Setting min and max values for columns in mod collection...`);
        let minMaxes: Record<string, {min: number; max: number}> = {};
        for (const mod of this.schema) {
            logger.info(`Setting min and max values for columns in mod: ${mod.name} ${mod.version}`);
            for (const column of mod.columns) {
                let minMaxResponse = await this.client
                    .db(process.env['MONGO_DB_NAME'])
                    .collection(`${mod.name} ${mod.version}`)
                    .aggregate([
                        {
                            $group: {
                                _id: null,
                                min: {$min: `$${column.label}`},
                                max: {$max: `$${column.label}`},
                            },
                        },
                    ])
                    .toArray();
                let minMax = minMaxResponse[0];
                let min = minMax?.['min'];
                let max = minMax?.['max'];
                if (min === undefined) {
                    min = 0;
                }
                if (max === undefined) {
                    max = Number.MAX_SAFE_INTEGER;
                }
                minMaxes[column.label] = {min: min, max: max};
            }
            await this.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .updateMany(
                    {name: mod.name, version: mod.version},
                    {
                        $set: {
                            columns: mod.columns.map(column => ({
                                label: column.label,
                                type: column.type,
                                min: minMaxes[column.label]?.min || 0,
                                max: minMaxes[column.label]?.max || Number.MAX_SAFE_INTEGER,
                            })),
                        },
                    }
                );
        }
    }
}

export default DatabaseService;
