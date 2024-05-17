import pino from 'pino';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, LOGGER_TOKEN, ROOT_DIRECTORY} from '../../globalConstants';
import ServerEnvironment from '../types/ServerEnvironments';
import pinoCaller from 'pino-caller';
import {container, singleton} from 'tsyringe';

const createLogger = (): pino.Logger => {
    return process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.DEVELOPMENT ||
        process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.TEST
        ? pino({
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                  },
              },
          })
        : pino();
};

@singleton()
class Logger {
    constructor() {
        return pinoCaller(createLogger(), {relativeTo: ROOT_DIRECTORY});
    }
}

container.register(LOGGER_TOKEN, Logger);

export const logger: pino.Logger = container.resolve(LOGGER_TOKEN);
