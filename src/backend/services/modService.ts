import MongoService from './mongoService'
import {Document, MongoClient} from 'mongodb'
import Mod from '../../types/Mod'
import {MOD_COLLECTION_NAME} from '../../globals'

class ModService {
    client: MongoClient

    constructor() {
        this.client = new MongoService().client
    }

    async getMods(): Promise<Mod[]> {
        await this.client.connect()
        const mods: Document[] = await this.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(MOD_COLLECTION_NAME)
            .find()
            .project({_id: 0})
            .toArray()
        return (mods as Mod[]) || []
    }

    async getModsByName(name: string): Promise<Mod[]> {
        await this.client.connect()
        const mods: Document[] = await this.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(MOD_COLLECTION_NAME)
            .find({name: name})
            .project({_id: 0})
            .toArray()
        return (mods as Mod[]) || []
    }
}

export default ModService
