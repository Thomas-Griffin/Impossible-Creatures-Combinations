import 'reflect-metadata'
import combinationsServer from './combinationsServer'
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, FRONTEND_CLIENT_PORT, PUBLIC_DIRECTORY} from '../globals'
import DatabaseService from './services/databaseService'
import logger from './utility/logger'
import environment from './utility/serverEnvironment'
import {resetCombinationsDatabase} from './database/resetCombinationsDatabase'
import {cleanupResidualDatabaseFiles} from './database/cleanupResidualDatabaseFiles'
import {app, BrowserWindow, BrowserWindowConstructorOptions} from 'electron'
import path from 'path'
import * as os from 'os'
import {loadNuxt, LoadNuxtOptions} from '@nuxt/kit'
import nuxtConfig from '../../nuxt.config'
import ServerEnvironments from '../types/ServerEnvironments'


environment.load()

let mainWindow: BrowserWindow | null

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
        `Checking if database for environment '${process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME]}' is initialised...`,
    )
    const initialised = await databaseService.databaseIsInitialised()
    if (!initialised) {
        runDatabaseScripts()
        logger.info('Database initialised')
    }
}

const startServer = () => {
    combinationsServer.listen(process.env['PORT'], () => {
        logger.info(`Server is running at http://localhost:${process.env['PORT']}`)
    })
    combinationsServer.on('error', (err: any) => logger.error(`Server error: ${err}`))
}

const createWindow = (): void => {
    let iconPath: string
    switch (os.platform()) {
        case 'win32':
            iconPath = path.resolve(PUBLIC_DIRECTORY, '/icons/icon.ico')
            break
        case 'darwin':
            iconPath = path.resolve(PUBLIC_DIRECTORY, '/icons/icon.icns')
            break
        case 'linux':
            iconPath = path.resolve(PUBLIC_DIRECTORY, '/icons/icon.png')
            break
        default:
            iconPath = path.resolve(PUBLIC_DIRECTORY, '/icons/icon.png')
            break
    }
    const windowOptions: BrowserWindowConstructorOptions = {
        fullscreen: true,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
        },
    }
    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(`http://localhost:${FRONTEND_CLIENT_PORT}`).catch(error => logger.error(error))

    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.webContents.on('did-fail-load', (errorEvent: any) => {
        logger.error('Failed to load:', errorEvent)
    })
}

const isRunningInElectron = (): boolean => {
    if (typeof window !== 'undefined' && window.process && window.process.type) {
        return true
    }
    if (process && process.versions && !!process.versions.electron) {
        return true
    }
    return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent.includes('Electron')
}


const startNuxtApp = async () => {
    nuxtConfig.dev = process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] !== ServerEnvironments.PRODUCTION
    const loadOptions:LoadNuxtOptions = {overrides: nuxtConfig, dev: nuxtConfig.dev, ready:true}
    await loadNuxt(loadOptions)
}

checkDatabaseInitialisation().then(() => {
    logger.info('Database initialisation check complete')
    logger.info('Starting server...')
    logger.info('Determining if running in electron...')
    if (isRunningInElectron()) {
        logger.info('Running in electron...')

        app.whenReady().then(createWindow)

        app.on('ready', () => {
            createWindow()
        })
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })
        app.on('activate', () => {
            if (mainWindow === null) {
                createWindow()
            }
        })
        logger.info('Using Electron, starting server...')
        startServer()
        logger.info('Server started')
        logger.info('Starting Nuxt Client...')
        startNuxtApp().catch(error => logger.error(error))
    } else {
        logger.info('Not running in electron, starting server...')
        startServer()
    }
})