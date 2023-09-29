const fs = require("fs");

const SCHEMA_FILE_NAME = 'schema.json';
const SCHEMA_FILE_PATH = `./services/${SCHEMA_FILE_NAME}`;
const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'));


for (let mod of schema) {
    fs.rm(`${mod.name} ${mod.version}.json`, {}, (err) => {
        if (err) {
            console.error(err);
        }
    });
}