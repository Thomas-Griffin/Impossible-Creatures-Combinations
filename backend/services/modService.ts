import MongoService from './mongoService';
import Mod from '../types/Mod';
import {Document} from 'mongodb';

class ModService extends MongoService {
    collectionName: string;

    constructor() {
        super();
        this.collectionName = 'mods';
    }

    async getMods(): Promise<Mod[]> {
        await this.client.connect();
        const mods: Document[] = await this.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(this.collectionName)
            .find()
            .project({_id: 0})
            .toArray();
        return (mods as Mod[]) || [];
    }

    async getModsByName(name: string): Promise<Mod[]> {
        await this.client.connect();
        const mods: Document[] = await this.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(this.collectionName)
            .find({name: name})
            .project({_id: 0})
            .toArray();
        return (mods as Mod[]) || [];
    }
}

export default ModService;
