import {MongoClient} from 'mongodb'
import {MONGO_CLIENT_TOKEN, MONGO_DOCKER_SERVICE_NAME, MONGO_DOCKER_SERVICE_PORT} from '../../globals'

import {container, singleton} from 'tsyringe'
import logger from '../utility/logger'
import serverEnvironment from '../utility/serverEnvironment'

const createMongoClient = (): MongoClient => {
    logger.info('Starting mongodb server')
    if (serverEnvironment.isInDockerContainer()) {
        process.env['MONGO_URL'] = `mongodb://${MONGO_DOCKER_SERVICE_NAME}:${MONGO_DOCKER_SERVICE_PORT}`
    }
    return new MongoClient(process.env['MONGO_URL'] || `mongodb://localhost:${MONGO_DOCKER_SERVICE_PORT}`)
}

container.register(MONGO_CLIENT_TOKEN, {useFactory: createMongoClient})

@singleton()
class MongoService {
    client: MongoClient

    constructor() {
        serverEnvironment.load()
        this.client = createMongoClient()
    }
}

export default MongoService
