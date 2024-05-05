import fs from 'fs';
import {ModSchema} from '../types/ModSchema';
import {ROOT_DIRECTORY} from '../globalConstants';
import schemas from './modSchemas';

async function removeModuleAndHandleError(mod: ModSchema) {
    const filePath = `${ROOT_DIRECTORY}/${mod.name} ${mod.version}.json`;
    try {
        if (fs.existsSync(filePath)) {
            console.log(`Removing ${filePath}...`);
            await fs.promises.rm(filePath);
        }
    } catch (err) {
        console.error(err);
    }
}

async function cleanup() {
    console.log('Cleaning up residual database files...');
    for (let module of schemas) {
        await removeModuleAndHandleError(module);
    }
}

export default cleanup;
