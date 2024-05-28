import fs from 'fs'
import schemas from '@backend/database/modSchemas'
import logger from '@backend/utility/logger'
import {MOD_DIRECTORY_PATH} from '@src/globals'
import ModSchema from '~types/ModSchema'

function removeModuleAndHandleError(mod: ModSchema) {
    const filePath = `${MOD_DIRECTORY_PATH}/${mod.name} ${mod.version}.json`
    logger.info(`Checking if ${filePath} exists...`)
    try {
        if (fs.existsSync(filePath)) {
            logger.info(`Removing ${filePath}...`)
            fs.rmSync(filePath)
        } else {
            logger.info(`${filePath} does not exist, and was not removed.`)
        }
    } catch (err) {
        logger.error(err)
    }
}

export function cleanupResidualDatabaseFiles() {
    logger.info('Cleaning up residual database files...')
    for (let module of schemas) {
        removeModuleAndHandleError(module)
    }
}
