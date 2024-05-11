import axios from 'axios';
import {
    ENVIRONMENT_SPECIFIER_FLAG_NAME,
    SERVER_DOCKER_SERVICE_NAME,
    SERVER_DOCKER_SERVICE_PORT,
} from '../../globalConstants';
import ServerEnvironment from '../types/ServerEnvironment';
import Logger from '../utility/logger';

const logger = Logger.getInstance();

function reset() {
    logger.info('Resetting database...');
    axios
        .get(
            `${process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.PRODUCTION ? `http://${SERVER_DOCKER_SERVICE_NAME}:${SERVER_DOCKER_SERVICE_PORT}` : `http://localhost:${SERVER_DOCKER_SERVICE_PORT}`}/database/reset`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 2147483647,
            }
        )
        .then(response => {
            logger.info(response.data);
        })
        .catch(error => logger.error(error));
}

export default reset;
