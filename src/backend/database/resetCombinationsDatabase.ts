import axios from 'axios'
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, SERVER_DOCKER_SERVICE_NAME, SERVER_DOCKER_SERVICE_PORT} from '@src/globals'
import {logger} from '@backend/utility/logger'
import environment from '@backend/utility/serverEnvironment'
import ServerEnvironments from '~types/ServerEnvironments'

export function resetCombinationsDatabase() {
    logger.info('Resetting database...')
    let url: string =
        process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironments.PRODUCTION &&
        environment.isInDockerContainer()
            ? `http://${SERVER_DOCKER_SERVICE_NAME}:${SERVER_DOCKER_SERVICE_PORT}/database/reset`
            : `http://localhost:${SERVER_DOCKER_SERVICE_PORT}/database/reset`
    axios
        .get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 2147483647,
        })
        .then(response => {
            logger.info(response.data)
        })
        .catch(error => logger.error(error))
}
