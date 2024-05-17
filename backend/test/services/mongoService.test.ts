import MongoService from '../../src/services/mongoService';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '../../globalConstants';
import ServerEnvironment from '../../src/types/ServerEnvironments';

describe('MongoService', () => {
    it('should throw an error if the environment specifier is not set', () => {
        expect(() => {
            process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] = undefined;
            new MongoService();
        }).toThrow(
            Error(
                `Environment variable '${ENVIRONMENT_SPECIFIER_FLAG_NAME}' is not one of the allowed values: ${Object.values(ServerEnvironment)}. Current value: undefined`
            )
        );
    });
});
