import axios from 'axios';
import {
    ENVIRONMENT_SPECIFIER_FLAG_NAME,
    SERVER_DOCKER_SERVICE_NAME,
    SERVER_DOCKER_SERVICE_PORT,
} from '../../globalConstants';
import ServerEnvironment from '../types/ServerEnvironments';
import {logger} from '../utility/logger';
import {serverEnvironment} from '../utility/serverEnvironment';

function reset() {
    logger.info('Resetting database...');
    let url: string =
        process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.PRODUCTION &&
        serverEnvironment.isInDockerContainer()
            ? `${`http://${SERVER_DOCKER_SERVICE_NAME}:${SERVER_DOCKER_SERVICE_PORT}`}/database/reset`
            : `${`http://localhost:${SERVER_DOCKER_SERVICE_PORT}`}/database/reset`;
    axios
        .get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 2147483647,
        })
        .then(response => {
            logger.info(response.data);
        })
        .catch(error => logger.error(error));
}

export default reset;
