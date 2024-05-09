import {MongoClient} from 'mongodb';
import {MONGO_DOCKER_SERVICE_PORT} from '../globalConstants';
import ServerConfig from '../utility/serverConfig';

const serverConfig = ServerConfig.getInstance();

class MongoService {
    private static instance: MongoService;
    client: MongoClient;

    private constructor() {
        serverConfig.loadEnvironmentConfig();
        this.client = new MongoClient(process.env['MONGO_URL'] || `mongodb://localhost:${MONGO_DOCKER_SERVICE_PORT}`);
        this.client.db(process.env['MONGO_DB_NAME']);
    }

    public static getInstance(): MongoService {
        if (!MongoService.instance) {
            MongoService.instance = new MongoService();
        }
        return MongoService.instance;
    }
}

export default MongoService;
