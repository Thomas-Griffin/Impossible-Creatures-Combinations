const path = require("path");

process.env.MONGO_URL = 'mongodb://mongodb:27017';

require(path.resolve('./database/combinations/decompressor.js'));
require(path.resolve('./database/combinations/reset.js'));
require(path.resolve('./database/combinations/cleanup.js'));