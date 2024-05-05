import {MongoClient} from 'mongodb';
import ServerConfig from '../serverConfig';

const serverConfig = ServerConfig.getInstance();
serverConfig.initialise();

class MongoService {
    private static instance: MongoService;
    client: MongoClient;

    private constructor() {
        this.checkEnvironmentVariable('ENVIRONMENT');
        this.checkEnvironmentVariable('MONGO_URL');
        this.checkEnvironmentVariable('MONGO_DB_NAME');

        this.client = new MongoClient(process.env['MONGO_URL'] || 'mongodb://localhost:27017');
        this.client.db(process.env['MONGO_DB_NAME']);
    }

    public static getInstance(): MongoService {
        if (!MongoService.instance) {
            MongoService.instance = new MongoService();
        }
        return MongoService.instance;
    }

    private checkEnvironmentVariable(variable: string) {
        if (!process.env[variable]) {
            console.error(`Environment variable '${variable}' is not set`);
            process.exit(1);
        }
    }
}

export default MongoService;
