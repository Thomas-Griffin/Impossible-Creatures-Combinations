const fs = require("fs");
const messagePack = require('msgpack-lite');
const {unzipSync} = require("zlib");

const SCHEMA_FILE_NAME = 'schema.json';
const SCHEMA_FILE_PATH = `../services/${SCHEMA_FILE_NAME}`;
const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'));

for (let mod of schema) {
    const modFileName = `${mod.name} ${mod.version}.msgpack.gz`;
    const compressedData = fs.readFileSync(modFileName);
    const unzippedData = unzipSync(compressedData);
    const decoded = messagePack.decode(unzippedData);
    fs.writeFileSync(`${mod.name} ${mod.version}.json`, JSON.stringify(decoded));
}

