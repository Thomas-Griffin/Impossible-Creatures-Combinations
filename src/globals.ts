import {resolve} from 'path'
import Joi from 'joi'

import schemas from '@backend/database/modSchemas'
import mods from '@backend/database/mods'
import ModNames from '~types/ModNames'
import {modVersions} from '~types/ModVersions'
import PlotlyVisualisationTypes from '~types/PlotlyVisualisationTypes'
import ModSchema from '~types/ModSchema'
import Mod from '~types/Mod'

export const ROOT_DIRECTORY = resolve('./')
export const SRC_DIRECTORY = resolve(ROOT_DIRECTORY, 'src')
export const MOD_COLLECTION_NAME = 'mods'
export const MOD_DIRECTORY_NAME = 'mods'
export const MOD_SOURCE_DIRECTORY_PATH = resolve(SRC_DIRECTORY, `backend/database/${MOD_DIRECTORY_NAME}`)
export const MOD_DIRECTORY_PATH = resolve(ROOT_DIRECTORY, MOD_DIRECTORY_NAME)
export const COMBINATIONS_COLLECTION_NAME = 'combinations'
export const ENV_DIRECTORY = resolve(SRC_DIRECTORY, 'env')

export const LOGGER_TOKEN = 'Logger'
export const MONGO_CLIENT_TOKEN = 'MongoClient'
export const SERVER_ENVIRONMENT_TOKEN = 'ServerEnvironment'

export const COMPRESSED_DATA_FILE_EXTENSION = '.msgpack.gz'

export const ENVIRONMENT_SPECIFIER_FLAG_NAME = 'ENVIRONMENT'

export const MONGO_DOCKER_SERVICE_NAME = 'combinations-database'
export const MONGO_DOCKER_SERVICE_PORT = 27017

export const SERVER_DOCKER_SERVICE_NAME = 'combinations-server'
export const SERVER_DOCKER_SERVICE_PORT = 3000

export const MOD_SCHEMAS: ModSchema[] = schemas

export const DEFAULT_MOD: Mod = mods[0]

export const JOI_MOD_SCHEMA = Joi.object({
    name: Joi.string()
        .valid(...Object.values(ModNames))
        .required(),
    version: Joi.string()
        .valid(...Object.values(modVersions))
        .required(),
    columns: Joi.array().optional(),
}).unknown()

export const JOI_CHART_REQUEST_BODY_SCHEMA = Joi.object({
    mod: JOI_MOD_SCHEMA.required(),
    chartOptions: Joi.object({
        sort: Joi.boolean().optional(),
        chartType: Joi.string()
            .valid(...Object.values(PlotlyVisualisationTypes))
            .optional(),
    }).optional(),
    columns: Joi.array().items(Joi.object()).optional(),
    attributes: Joi.object({x: Joi.string(), y: Joi.string().optional()}).optional(),
    bucketSize: Joi.number().optional(),
    categories: Joi.object({x: Joi.string().optional(), y: Joi.string().optional()}).optional(),
})

export const MOD_COMBINATION_TOTALS = [
    {name: ModNames.VANILLA, version: '1.1', total: 52760},
    {name: ModNames.INSECT_INVASION, version: '1.4', total: 85980},
    {name: ModNames.SMOD, version: '9.25', total: 120000},
    {name: ModNames.TELLURIAN, version: '2.0', total: 128328},
    {name: ModNames.TELLURIAN, version: '2.9.1.4', total: 159448},
    {name: ModNames.TELLURIAN, version: '2.10', total: 171952},
    {name: ModNames.TELLURIAN, version: '2.10.0.3', total: 173224},
]
