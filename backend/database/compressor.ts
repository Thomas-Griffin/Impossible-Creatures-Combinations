import fs from 'fs';
import readline from 'readline';
import messagePack from 'msgpack-lite';
import {deflateSync} from 'zlib';
import schemas from './modSchemas';
import path from 'path';

function compress() {
    for (let mod of schemas) {
        const modFileName = `${mod.name} ${mod.version}.json`;
        const readStream = fs.createReadStream(path.resolve(__dirname, modFileName));
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });

        rl.on('line', line => {
            try {
                const jsonObject = JSON.parse(line);
                const compressedObject = messagePack.encode(jsonObject);

                fs.open(`${mod.name} ${mod.version}.msgpack`, 'w', err => {
                    if (err) {
                        if (err.code === 'EEXIST') {
                            console.error('file already exists');
                            return;
                        }
                        throw err;
                    }
                });

                fs.appendFileSync(`${mod.name} ${mod.version}.msgpack`, compressedObject);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });

        rl.on('close', () => {
            console.log(`Finished reading JSON file. ${mod.name} ${mod.version}.msgpack created.`);
            let compressedData = deflateSync(fs.readFileSync(`${mod.name} ${mod.version}.msgpack`));
            fs.writeFileSync(`${mod.name} ${mod.version}.msgpack.gz`, compressedData);
            console.log(`Data compressed and saved. ${mod.name} ${mod.version}.msgpack.gz created.`);
            fs.rmSync(`${mod.name} ${mod.version}.msgpack`);
        });
    }
}

export default compress;

compress();
