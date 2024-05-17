import fs from 'fs';
import {ModSchema} from '../types/ModSchema';
import {ROOT_DIRECTORY} from '../../globalConstants';
import schemas from './modSchemas';
import {logger} from '../utility/logger';

async function removeModuleAndHandleError(mod: ModSchema) {
    const filePath = `${ROOT_DIRECTORY}/${mod.name} ${mod.version}.json`;
    logger.info(`Checking if ${filePath} exists...`);
    try {
        if (fs.existsSync(filePath)) {
            logger.info(`Removing ${filePath}...`);
            await fs.promises.rm(filePath);
        } else {
            logger.info(`${filePath} does not exist, and was not removed.`);
        }
    } catch (err) {
        logger.error(err);
    }
}

async function cleanup() {
    logger.info('Cleaning up residual database files...');
    for (let module of schemas) {
        await removeModuleAndHandleError(module);
    }
}

export default cleanup;
