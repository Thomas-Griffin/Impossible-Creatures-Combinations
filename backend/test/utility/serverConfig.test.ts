import ServerConfig from '../../src/utility/serverConfig';
import ServerEnvironment from '../../src/types/ServerEnvironment';

describe('serverConfig', () => {
    it('should return the correct server configuration for the test environment', () => {
        const serverConfig = ServerConfig.getInstance();
        serverConfig.loadEnvironmentConfig();
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironment.TEST);
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-test');
        expect(process.env['DEBUG']).toBe('jest-mongodb:*');
        expect(process.env['PORT']).toBe('3000');
    });

    it('should return the correct server configuration for the development environment', () => {
        process.env['ENVIRONMENT'] = ServerEnvironment.DEVELOPMENT;
        const serverConfig = ServerConfig.getInstance();
        serverConfig.loadEnvironmentConfig();
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironment.DEVELOPMENT);
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-development');
        expect(process.env['MONGO_URL']).toBe('mongodb://localhost:27017');
        expect(process.env['PORT']).toBe('3000');
    });

    it('should return the correct server configuration for the local production environment', () => {
        process.env['ENVIRONMENT'] = ServerEnvironment.PRODUCTION;
        process.env['MONGO_URL'] = undefined;
        process.env['MONGO_DB_NAME'] = undefined;
        const serverConfig = ServerConfig.getInstance();
        serverConfig.loadEnvironmentConfig();
        expect(process.env['ENVIRONMENT']).toBe(ServerEnvironment.PRODUCTION);
        expect(process.env['MONGO_DB_NAME']).toBe('combinations-production');
        expect(process.env['MONGO_URL']).toBe('mongodb://combinations-database:27017');
        expect(process.env['PORT']).toBe('3000');
    });
});
