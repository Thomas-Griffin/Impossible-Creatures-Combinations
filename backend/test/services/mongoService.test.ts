import MongoService from '../../services/mongoService';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '../../globalConstants';
import ServerEnvironment from '../../types/ServerEnvironment';

describe('MongoService', () => {
    it('should throw an error if the environment specifier is not set', () => {
        expect(() => {
            process.env[`${ENVIRONMENT_SPECIFIER_FLAG_NAME}`] = undefined;
            MongoService.getInstance();
        }).toThrow(
            Error(
                `Environment variable ${ENVIRONMENT_SPECIFIER_FLAG_NAME} is not set. Please set it to any of ${Object.values(ServerEnvironment)}. Current value: undefined`
            )
        );
    });
});
