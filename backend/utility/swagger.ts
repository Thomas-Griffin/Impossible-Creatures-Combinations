import swagger_autogen from 'swagger-autogen';
import {ROOT_DIRECTORY} from '../globalConstants';
import Logger from '../utility/logger';

const logger = Logger.getInstance();

const doc = {
    info: {
        title: 'Combinations API',
        description: 'Documentation',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
};

const swaggerAutogen = swagger_autogen();
const outputFile = `${ROOT_DIRECTORY}/swagger.json`;
const endpointsFiles = ['./app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(_ => {
    logger.info('Swagger JSON file created');
});
