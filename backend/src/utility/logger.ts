import pino from 'pino';
import {ENVIRONMENT_SPECIFIER_FLAG_NAME, ROOT_DIRECTORY} from '../../globalConstants';
import ServerEnvironment from '../types/ServerEnvironment';
import pinoCaller from 'pino-caller';

class Logger {
    private static instance: pino.Logger;

    private constructor() {}

    public static getInstance(): pino.Logger {
        if (!Logger.instance) {
            const logger =
                process.env[ENVIRONMENT_SPECIFIER_FLAG_NAME] === ServerEnvironment.DEVELOPMENT ||
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
            Logger.instance = pinoCaller(logger, {relativeTo: ROOT_DIRECTORY});
        }
        return Logger.instance;
    }
}

export default Logger;
