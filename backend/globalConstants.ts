import {resolve} from 'path';
import Joi from 'joi';
import Mod from './src/types/Mod';
import {readFileSync} from 'fs';
import schemas from './src/database/modSchemas';

export const ROOT_DIRECTORY = resolve(__dirname);
export const SRC_DIRECTORY = resolve(ROOT_DIRECTORY, './src');
export const MOD_COLLECTION_NAME = 'mods';
export const MOD_DIRECTORY_NAME = 'mods';
export const MOD_DIRECTORY_PATH = resolve(ROOT_DIRECTORY, `${MOD_DIRECTORY_NAME}`);
export const TEST_SCHEMA_FILE_NAME = 'testSchema.json';
export const ABILITIES_FILE_NAME = 'abilities.json';
export const TEST_SCHEMA_FILE_PATH = resolve(ROOT_DIRECTORY, `${TEST_SCHEMA_FILE_NAME}`);
export const ABILITIES_FILE_PATH = resolve(ROOT_DIRECTORY, `${ABILITIES_FILE_NAME}`);
export const COMBINATIONS_DIRECTORY_PATH = resolve(ROOT_DIRECTORY);
export const COMBINATIONS_COLLECTION_NAME = 'combinations';
export const ENV_DIRECTORY = resolve(SRC_DIRECTORY, 'env');

export const LOGGER_TOKEN = 'Logger';
export const MONGO_CLIENT_TOKEN = 'MongoClient';
export const SERVER_ENVIRONMENT_TOKEN = 'ServerEnvironment';

export const CLEANUP_SCRIPT_PATH = resolve(ROOT_DIRECTORY, './src/database/cleanup');
export const DECOMPRESSOR_SCRIPT_PATH = resolve(ROOT_DIRECTORY, './src/database/decompressor');
export const RESET_SCRIPT_PATH = resolve(ROOT_DIRECTORY, './src/database/reset');
export const COMPRESSOR_SCRIPT_PATH = resolve(ROOT_DIRECTORY, './src/database/compressor');
export const COMPRESSED_DATA_FILE_EXTENSION = '.msgpack.gz';

export const ENVIRONMENT_SPECIFIER_FLAG_NAME = 'ENVIRONMENT';

export const MONGO_DOCKER_SERVICE_NAME = 'combinations-database';
export const MONGO_DOCKER_SERVICE_PORT = 27017;
export const MONGO_DB_NAME_PREFIX = 'combinations';

export const SERVER_DOCKER_SERVICE_NAME = 'combinations-server';
export const SERVER_DOCKER_SERVICE_PORT = 3000;

let mods: Mod[] = schemas;
const testMods: Mod[] = JSON.parse(readFileSync(TEST_SCHEMA_FILE_PATH, 'utf8'));
mods = mods.concat(testMods);

export const JOI_MOD_SCHEMA = Joi.object({
    name: Joi.string()
        .valid(...mods.map(mod => mod.name))
        .required(),
    version: Joi.string()
        .valid(...mods.map(mod => mod.version))
        .required(),
    columns: Joi.array().optional(),
}).unknown();

export const JOI_CHART_REQUEST_BODY_SCHEMA = Joi.object({
    mod: JOI_MOD_SCHEMA.required(),
    chartOptions: Joi.object({
        sort: Joi.boolean().optional(),
        chartType: Joi.string().valid('bar', 'line').optional(),
    }).optional(),
    columns: Joi.array().items(Joi.object()).optional(),
    attributes: Joi.object({x: Joi.string(), y: Joi.string().optional()}).optional(),
    bucketSize: Joi.number().optional(),
    categories: Joi.object({x: Joi.string().optional(), y: Joi.string().optional()}).optional(),
});

export const MOD_COMBINATION_TOTALS = [
    {name: 'Impossible Creatures', version: '1.1', total: 52760},
    {name: 'Insect Invasion', version: '1.4', total: 85980},
    {name: 'Smod', version: '9.25', total: 120000},
    {name: 'Tellurian', version: '2.0', total: 128328},
    {name: 'Tellurian', version: '2.9.1.4', total: 159448},
    {name: 'Tellurian', version: '2.10', total: 171952},
    {name: 'Tellurian', version: '2.10.0.3', total: 173224},
];
