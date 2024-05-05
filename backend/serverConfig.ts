import dotenv from 'dotenv';

class ServerConfig {
    public static readonly MONGO_DB_NAME: string =
        process.env.MONGO_DB_NAME || `combinations-${process.env.ENVIRONMENT}`;
    private static readonly DEFAULT_PORT: number = 3000;
    public static readonly PORT: number = parseInt(process.env.PORT || ServerConfig.DEFAULT_PORT.toString());
    private static readonly DEFAULT_MONGO_URL: string = 'mongodb://localhost:27017';
    public static readonly MONGO_URL: string = process.env.MONGO_URL || ServerConfig.DEFAULT_MONGO_URL;
    private static readonly DEFAULT_ENVIRONMENT: string = 'development';
    private static instance: ServerConfig;

    private constructor() {}

    public static getInstance(): ServerConfig {
        if (!ServerConfig.instance) {
            ServerConfig.instance = new ServerConfig();
        }
        return ServerConfig.instance;
    }

    public initialise(): void {
        this.loadEnvironmentVariables();
        this.verifyEnvironmentVariables();
    }

    private loadEnvironmentVariables(): void {
        const environment = process.env.ENVIRONMENT || ServerConfig.DEFAULT_ENVIRONMENT;
        if (environment != 'production') dotenv.config({path: `./${environment}.env`});
        else if (environment == 'production' && (!process.env.MONGO_URL || !process.env.MONGO_DB_NAME)) {
            dotenv.config({path: './production.local.env'});
        }
        process.env.PORT = ServerConfig.PORT.toString();
    }

    private verifyEnvironmentVariables(): void {
        if (!process.env.ENVIRONMENT) {
            console.error('Environment not set');
            process.exit(1);
        }

        if (process.env.ENVIRONMENT === 'production' && (!ServerConfig.MONGO_URL || !ServerConfig.MONGO_DB_NAME)) {
            process.env.MONGO_URL = 'mongodb://combinations-database:27017';
            process.env.MONGO_DB_NAME = 'combinations-production';
        }
    }
}

export default ServerConfig;
