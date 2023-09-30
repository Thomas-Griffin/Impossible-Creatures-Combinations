const fs = require("fs");
const path = require("path");
const messagePack = require('msgpack-lite');
const {unzipSync} = require("zlib");

const SCHEMA_FILE_NAME = 'schema.json';
const SCHEMA_FILE_PATH = path.resolve(`./services/${SCHEMA_FILE_NAME}`);
const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'));

for (let mod of schema) {
    console.log(`Decompressing ${mod.name} ${mod.version}...`);
    const modFileName = `${mod.name} ${mod.version}.msgpack.gz`;
    const modFilePath = path.resolve(`./database/combinations/${modFileName}`);
    const compressedData = fs.readFileSync(modFilePath);
    const unzippedData = unzipSync(compressedData);
    const decoded = messagePack.decode(unzippedData);
    fs.writeFileSync(path.resolve(`./database/combinations/${mod.name} ${mod.version}.json`), JSON.stringify(decoded));
}

