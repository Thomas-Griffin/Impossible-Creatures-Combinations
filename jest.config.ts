import {JestConfigWithTsJest, pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'
import {defaults} from 'ts-jest/presets'
import jestMongodbConfig from './jest-mongodb-config'

const config: JestConfigWithTsJest = {
    preset: '@shelf/jest-mongodb',
    transform: defaults.transform,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'}),
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    testEnvironmentOptions: {
        'jest-mongodb': jestMongodbConfig,
    },
}
export default config
