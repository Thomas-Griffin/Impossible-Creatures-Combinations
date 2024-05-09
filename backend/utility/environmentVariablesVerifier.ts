import ServerEnvironment from '../types/ServerEnvironment';

import {
    ENVIRONMENT_SPECIFIER_FLAG_NAME,
    MONGO_DB_NAME_PREFIX,
    MONGO_DOCKER_SERVICE_NAME,
    MONGO_DOCKER_SERVICE_PORT,
} from '../globalConstants';

export class EnvironmentVariablesVerifier {
    ensureValidServerEnvironment(): void {
        this.verify(ENVIRONMENT_SPECIFIER_FLAG_NAME, false, Object.values(ServerEnvironment));
        this.handleLocalDockerEnvironment();
    }

    handleLocalDockerEnvironment(): void {
        if (
            process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.PRODUCTION &&
            (!process.env.MONGO_URL || !process.env.MONGO_DB_NAME)
        ) {
            process.env.MONGO_URL = `mongodb://${MONGO_DOCKER_SERVICE_NAME}:${MONGO_DOCKER_SERVICE_PORT}`;
            process.env.MONGO_DB_NAME = `${MONGO_DB_NAME_PREFIX}-${ServerEnvironment.PRODUCTION}`;
        }
    }

    verify(variable: string, allowEmpty?: boolean, allowedValues?: string[]): void {
        if (!process.env[variable]) {
            throw this.generateVariableErrorMessage(variable, 'is not set');
        }
        if (!allowEmpty && process.env[variable] === '') {
            throw this.generateVariableErrorMessage(variable, 'is empty');
        }
        if (allowedValues && !allowedValues.includes(process.env[variable] || '')) {
            throw this.generateVariableErrorMessage(variable, `is not one of the allowed values: ${allowedValues}`);
        }
    }

    private generateVariableErrorMessage(variable: string, errorMessage: string): Error {
        return new Error(`Environment variable '${variable}' ${errorMessage}`);
    }
}
