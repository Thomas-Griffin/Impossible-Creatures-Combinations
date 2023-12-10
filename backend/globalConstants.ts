import { resolve } from 'path'

export const ROOT_DIRECTORY = resolve('./')

export const MOD_COLLECTION_NAME = 'mods'
export const MOD_DIRECTORY_NAME = 'mods'
export const MOD_DIRECTORY = resolve(ROOT_DIRECTORY, `./${MOD_DIRECTORY_NAME}`)
export const SCHEMA_FILE_NAME = 'schema.json'
export const ABILITIES_FILE_NAME = 'abilities.json'

export const SCHEMA_FILE_PATH = resolve(ROOT_DIRECTORY, `./services/${SCHEMA_FILE_NAME}`)
export const ABILITIES_FILE_PATH = resolve(ROOT_DIRECTORY, `./services/${ABILITIES_FILE_NAME}`)
export const COMBINATIONS_DIRECTORY = resolve(ROOT_DIRECTORY, './database/combinations')
