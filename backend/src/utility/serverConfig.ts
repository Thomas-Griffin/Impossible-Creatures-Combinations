import dotenv from 'dotenv';
import {EnvironmentVariablesVerifier} from './environmentVariablesVerifier';
import ServerEnvironment from '../types/ServerEnvironment';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, SRC_DIRECTORY} from '../../globalConstants';

const verifier = new EnvironmentVariablesVerifier();

class ServerConfig {
    private static instance: ServerConfig;

    private constructor() {
        this.loadEnvironmentConfig();
        verifier.ensureValidServerEnvironment();
    }

    public static getInstance(): ServerConfig {
        if (!ServerConfig.instance) {
            ServerConfig.instance = new ServerConfig();
        }
        return ServerConfig.instance;
    }

    public loadEnvironmentConfig(): void {
        if (
            Object.values(ServerEnvironment).includes(process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] as ServerEnvironment)
        ) {
            if (process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] != ServerEnvironment.PRODUCTION)
                dotenv.config({
                    path: `${SRC_DIRECTORY}/env/${process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`]}.env`,
                    override: true,
                    debug: true,
                });
            else if (
                (process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] == ServerEnvironment.PRODUCTION &&
                    (!process.env['MONGO_URL'] || !process.env['MONGO_DB_NAME'])) ||
                process.env['MONGO_URL'] == 'undefined' ||
                process.env['MONGO_DB_NAME'] == 'undefined'
            ) {
                dotenv.config({path: `${SRC_DIRECTORY}/env/production.local.env`, override: true, debug: true});
            }
        } else {
            throw new Error(
                `Environment variable ${ENVIRONMENT_SPECIFIER_FLAG_NAME} is not set. Please set it to any of ${Object.values(ServerEnvironment)}. Current value: ${
                    process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME]
                }`
            );
        }
    }
}

export default ServerConfig;
