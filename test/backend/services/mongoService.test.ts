import {ENVIRONMENT_SPECIFIER_FLAG_NAME} from '../../../src/globals'
import MongoService from '../../../src/backend/services/mongoService'
import ServerEnvironments from '../../../src/types/ServerEnvironments'

describe('MongoService', () => {
    it('should default to production if the environment specifier is not set', () => {
        process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] = undefined
            new MongoService()
        expect(process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME]).toBe(ServerEnvironments.PRODUCTION)
    })
})
