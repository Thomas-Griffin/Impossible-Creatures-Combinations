const dotenv = require('dotenv');
require('reflect-metadata');

dotenv.config({path: 'src/env/test.env', override: true, debug: true});

if (!global.__MONGO_URI__) {
    console.error('ERROR: global.__MONGO_URI__ is not defined');
    process.exit(1);
} else {
    process.env.MONGO_URL = global.__MONGO_URI__;
}
