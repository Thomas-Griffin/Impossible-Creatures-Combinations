import app from './app';

import {CLEANUP_SCRIPT_PATH, RESET_SCRIPT_PATH} from './globalConstants';

import MongoService from './services/mongoService';
import DatabaseService from './services/databaseService';

const runDatabaseScripts = async () => {
    try {
        const resetScript = await import(RESET_SCRIPT_PATH);
        const cleanupScript = await import(CLEANUP_SCRIPT_PATH);
        resetScript.default();
        cleanupScript.default();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const checkDatabaseInitialisation = async () => {
    const databaseService = new DatabaseService(MongoService.getInstance());
    console.log(`Checking if database for environment '${process.env['ENVIRONMENT']}' is initialised...`);
    const initialised = await databaseService.databaseIsInitialised();
    if (!initialised) {
        await runDatabaseScripts();
        console.log('Database initialised');
    }
};

const startServer = () => {
    app.listen(process.env['PORT'], () => {
        console.log(`Server is running at http://localhost:${process.env['PORT']}`);
    });
    app.on('error', err => console.error(`Server error: ${err}`));
};

checkDatabaseInitialisation().then(() => {
    startServer();
});
