import 'reflect-metadata'
import {config} from 'dotenv'
import {ENV_DIRECTORY} from './src/globals'

config({path: `${ENV_DIRECTORY}/test.env`, override: true, debug: true})
