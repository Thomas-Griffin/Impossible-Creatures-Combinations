import 'reflect-metadata'
import app from '@backend/app'
import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '../globals'
import DatabaseService from '@backend/services/databaseService'
import logger from '@backend/utility/logger'
import environment from '@backend/utility/serverEnvironment'
import {resetCombinationsDatabase} from '@backend/database/resetCombinationsDatabase'
import {cleanupResidualDatabaseFiles} from '@backend/database/cleanupResidualDatabaseFiles'

environment.load()

const runDatabaseScripts = () => {
    try {
        resetCombinationsDatabase()
        cleanupResidualDatabaseFiles()
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

const checkDatabaseInitialisation = async () => {
    const databaseService = new DatabaseService()
    logger.info(
        `Checking if database for environment '${process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME]}' is initialised...`
    )
    const initialised = await databaseService.databaseIsInitialised()
    if (!initialised) {
        runDatabaseScripts()
        logger.info('Database initialised')
    }
}

const startServer = () => {
    app.listen(process.env['PORT'], () => {
        logger.info(`Server is running at http://localhost:${process.env['PORT']}`)
    })
    app.on('error', err => logger.error(`Server error: ${err}`))
}

checkDatabaseInitialisation().then(() => {
    startServer()
})
