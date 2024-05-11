import fs from 'fs';
import {ModSchema} from '../types/ModSchema';
import {ROOT_DIRECTORY} from '../../globalConstants';
import schemas from './modSchemas';
import Logger from '../utility/logger';

const logger = Logger.getInstance();

async function removeModuleAndHandleError(mod: ModSchema) {
    const filePath = `${ROOT_DIRECTORY}/${mod.name} ${mod.version}.json`;
    try {
        if (fs.existsSync(filePath)) {
            logger.info(`Removing ${filePath}...`);
            await fs.promises.rm(filePath);
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
