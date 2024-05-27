import {MONGO_DOCKER_SERVICE_NAME, MONGO_DOCKER_SERVICE_PORT} from '@src/globals'
import environment from '@backend/utility/serverEnvironment'
import ServerEnvironments from '~types/ServerEnvironments'

describe('load()', () => {
    it('should return the correct server configuration for the test environment', () => {
        environment.load()
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironments.TEST)
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-test')
        expect(process.env['DEBUG']).toBe('jest-mongodb:*')
        expect(process.env['PORT']).toBe('3000')
    })

    it('should return the correct server configuration for the development environment', () => {
        process.env['ENVIRONMENT'] = ServerEnvironments.DEVELOPMENT
        environment.load()
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironments.DEVELOPMENT)
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-development')
        expect(process.env['MONGO_URL']).toBe(`mongodb://localhost:${MONGO_DOCKER_SERVICE_PORT}`)
        expect(process.env['PORT']).toBe('3000')
    })

    it('should return the correct server configuration for the local production environment', () => {
        process.env['ENVIRONMENT'] = ServerEnvironments.PRODUCTION
        process.env['MONGO_URL'] = undefined
        process.env['MONGO_DB_NAME'] = undefined
        environment.load()
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironments.PRODUCTION)
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-production')
        expect(process.env['MONGO_URL']).toBe(`mongodb://localhost:${MONGO_DOCKER_SERVICE_PORT}`)
        expect(process.env['PORT']).toBe('3000')
    })

    it('should return the correct configuration for the local docker environment', () => {
        process.env['ENVIRONMENT'] = ServerEnvironments.PRODUCTION
        process.env['MONGO_URL'] = undefined
        process.env['MONGO_DB_NAME'] = undefined
        const mockIsInDockerContainer = jest.spyOn(environment, 'isInDockerContainer')
        mockIsInDockerContainer.mockImplementation(() => true)
        environment.load()
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironments.PRODUCTION)
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-production')
        expect(process.env['MONGO_URL']).toBe(`mongodb://${MONGO_DOCKER_SERVICE_NAME}:${MONGO_DOCKER_SERVICE_PORT}`)
        expect(process.env['PORT']).toBe('3000')
    })
})
