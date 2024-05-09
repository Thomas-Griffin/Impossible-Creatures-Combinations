import axios from 'axios';
import {
    ENVIRONMENT_SPECIFIER_FLAG_NAME,
    SERVER_DOCKER_SERVICE_NAME,
    SERVER_DOCKER_SERVICE_PORT,
} from '../globalConstants';
import ServerEnvironment from '../types/ServerEnvironment';

function reset() {
    console.log('Resetting database...');
    axios
        .get(
            `${process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`] === ServerEnvironment.PRODUCTION ? `http://${SERVER_DOCKER_SERVICE_NAME}:${SERVER_DOCKER_SERVICE_PORT}` : `http://localhost:${SERVER_DOCKER_SERVICE_PORT}`}/database/reset`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 2147483647,
            }
        )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.log(error));
}

export default reset;
