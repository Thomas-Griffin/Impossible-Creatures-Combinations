import {MongoClient} from 'mongodb';

class MongoService {
    mongoUrl: string;
    client: MongoClient;

    constructor() {
        if (!process.env['ENVIRONMENT']) {
            console.debug(process.env);
            console.error('Environment not set');
            process.exit(1);
        }
        if (!process.env['MONGO_URL']) {
            console.debug(process.env);
            console.error('Mongo URL not set');
            process.exit(1);
        }
        if (!process.env['MONGO_DB_NAME']) {
            console.debug(process.env);
            console.error('Mongo DB name not set');
            process.exit(1);
        }

        this.mongoUrl = process.env['MONGO_URL'];
        this.client = new MongoClient(this.mongoUrl);
        this.client.db(process.env['MONGO_DB_NAME']);
    }
}

export default MongoService;
