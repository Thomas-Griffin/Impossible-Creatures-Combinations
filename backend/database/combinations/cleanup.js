const fs = require("fs");

const SCHEMA_FILE_NAME = 'schema.json';
const SCHEMA_FILE_PATH = `./services/${SCHEMA_FILE_NAME}`;
const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'));

console.log('Cleaning up...')
for (let mod of schema) {
    console.log(`Removing ${mod.name} ${mod.version}.json...`)
    fs.rm(`./database/combinations/${mod.name} ${mod.version}.json`, {}, (err) => {
        if (err) {
            console.error(err);
        }
    });
}