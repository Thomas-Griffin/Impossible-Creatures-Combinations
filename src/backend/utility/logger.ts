import pino from 'pino'
import pinoCaller from 'pino-caller'
import {container, singleton} from 'tsyringe'
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, LOGGER_TOKEN, ROOT_DIRECTORY} from '../../globals'
import ServerEnvironments from '../../types/ServerEnvironments'

const createLogger = (): pino.Logger => {
    return process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironments.DEVELOPMENT ||
        process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironments.TEST
        ? pino({
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                  },
              },
          })
        : pino()
}

@singleton()
class Logger {
    constructor() {
        return pinoCaller(createLogger(), {relativeTo: ROOT_DIRECTORY})
    }
}

container.register(LOGGER_TOKEN, Logger)

export const logger: pino.Logger = container.resolve(LOGGER_TOKEN)

export default logger
