import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '@src/globals'
import MongoService from '@backend/services/mongoService'
import ServerEnvironments from '~types/ServerEnvironments'

describe('MongoService', () => {
    it('should throw an error if the environment specifier is not set', () => {
        expect(() => {
            process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] = undefined
            new MongoService()
        }).toThrow(
            Error(
                `Environment variable '${ENVIRONMENT_SPECIFIER_FLAG_NAME}' is not one of the allowed values: ${Object.values(ServerEnvironments)}. Current value: undefined`
            )
        )
    })
})
