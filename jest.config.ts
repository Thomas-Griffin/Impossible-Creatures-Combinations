import {JestConfigWithTsJest} from 'ts-jest'
import {defaults} from 'ts-jest/presets'
import jestMongodbConfig from './jest-mongodb-config'

const config: JestConfigWithTsJest = {
    preset: '@shelf/jest-mongodb',
    transform: defaults.transform,
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    testEnvironmentOptions: {
        'jest-mongodb': jestMongodbConfig,
    },
    updateSnapshot: false,
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/.output/',
    ],
}
export default config
