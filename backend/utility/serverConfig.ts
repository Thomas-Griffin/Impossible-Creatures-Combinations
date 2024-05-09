import dotenv from 'dotenv';
import {EnvironmentVariablesVerifier} from './environmentVariablesVerifier';
import ServerEnvironment from '../types/ServerEnvironment';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '../globalConstants';

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
            Object.values(ServerEnvironment).includes(
                process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`] as ServerEnvironment
            )
        ) {
            if (process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`] != ServerEnvironment.PRODUCTION)
                dotenv.config({path: `./${process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`]}.env`});
            else if (
                process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`] == ServerEnvironment.PRODUCTION &&
                (!process.env['MONGO_URL'] || !process.env['MONGO_DB_NAME'])
            ) {
                dotenv.config({path: './production.local.env'});
            }
        } else {
            throw new Error(
                `Environment variable ${ENVIRONMENT_SPECIFIER_FLAG_NAME} is not set. Please set it to any of ${Object.values(ServerEnvironment)}. Current value: ${
                    process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`]
                }`
            );
        }
    }
}

export default ServerConfig;
