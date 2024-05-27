import 'reflect-metadata'
import swagger_autogen from 'swagger-autogen'
import path from 'path'
import {logger} from './logger'
import {ROOT_DIRECTORY} from '@src/globals'

const doc = {
    info: {
        title: 'Combinations API',
        description: 'Documentation',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
}

const swaggerAutogen = swagger_autogen()
const outputFile = `${ROOT_DIRECTORY}/swagger.json`
const endpointsFiles = [path.resolve(ROOT_DIRECTORY, 'src/backend/app.ts')]

swaggerAutogen(outputFile, endpointsFiles, doc).then(_ => {
    logger.info('Swagger JSON file created')
})
