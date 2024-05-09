import app from './app';

import {CLEANUP_SCRIPT_PATH, ENVIRONMENT_SPECIFIER_FLAG_NAME, RESET_SCRIPT_PATH} from './globalConstants';

import MongoService from './services/mongoService';
import DatabaseService from './services/databaseService';

import Logger from './utility/logger';

const logger = Logger.getInstance();

const runDatabaseScripts = async () => {
    try {
        const resetScript = await import(RESET_SCRIPT_PATH);
        const cleanupScript = await import(CLEANUP_SCRIPT_PATH);
        resetScript.default();
        cleanupScript.default();
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

const checkDatabaseInitialisation = async () => {
    const databaseService = new DatabaseService(MongoService.getInstance());
    logger.info(
        `Checking if database for environment '${process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`]}' is initialised...`
    );
    const initialised = await databaseService.databaseIsInitialised();
    if (!initialised) {
        await runDatabaseScripts();
        logger.info('Database initialised');
    }
};

const startServer = () => {
    app.listen(process.env['PORT'], () => {
        logger.info(`Server is running at http://localhost:${process.env['PORT']}`);
    });
    app.on('error', err => logger.error(`Server error: ${err}`));
};

checkDatabaseInitialisation().then(() => {
    startServer();
});
