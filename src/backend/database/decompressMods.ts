import fs from 'fs'
import path from 'path'
import messagePack from 'msgpack-lite'
import {unzipSync} from 'zlib'
import {COMPRESSED_DATA_FILE_EXTENSION, MOD_SOURCE_DIRECTORY_PATH, ROOT_DIRECTORY} from '@src/globals'
import schemas from '@backend/database/modSchemas'
import logger from '@src/backend/utility/logger'

export function decompressMods() {
    for (let mod of schemas) {
        logger.info(
            `Decompressing ${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION} to JSON file at ${path.resolve(
                ROOT_DIRECTORY,
                `${mod.name} ${mod.version}.json`
            )}`
        )
        const modFileName = `${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION}`
        const modFilePath = path.resolve(MOD_SOURCE_DIRECTORY_PATH, `${modFileName}`)
        const compressedData = fs.readFileSync(modFilePath)
        const unzippedData = unzipSync(compressedData)
        const decoded = messagePack.decode(unzippedData)
        fs.writeFileSync(path.resolve(ROOT_DIRECTORY, `${mod.name} ${mod.version}.json`), JSON.stringify(decoded))
    }
}
