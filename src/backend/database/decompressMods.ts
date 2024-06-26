import fs from 'fs'
import path from 'path'
import messagePack from 'msgpack-lite'
import {unzipSync} from 'zlib'
import {COMPRESSED_DATA_FILE_EXTENSION, MOD_DIRECTORY_PATH, MOD_SOURCE_DIRECTORY_PATH} from '../../globals'
import schemas from '../database/modSchemas'
import logger from '..//utility/logger'

export function decompressMods() {
    for (let mod of schemas) {
        let sourceModJsonFilePath = path.resolve(MOD_SOURCE_DIRECTORY_PATH, `${mod.name} ${mod.version}.json`)
        logger.info(`Decompressing ${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION} to JSON file at ${sourceModJsonFilePath}`)
        const modFilePath = path.resolve(MOD_SOURCE_DIRECTORY_PATH, `${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION}`)
        logger.info(`Reading compressed data from ${modFilePath}`)
        const compressedData = fs.readFileSync(modFilePath)
        logger.info(`Unzipping data...`)
        const unzippedData = unzipSync(compressedData)
        logger.info(`Decoding data...`)
        const decoded = messagePack.decode(unzippedData)
        logger.info(`Data decoded successfully for mod ${mod.name} ${mod.version}`)
        if (!fs.existsSync(MOD_DIRECTORY_PATH)) {
            logger.info(`Creating directory at ${MOD_DIRECTORY_PATH}`)
            fs.mkdirSync(MOD_DIRECTORY_PATH)
        }
        logger.info(`Writing decoded data to JSON file at ${sourceModJsonFilePath}...`)
        fs.writeFileSync(path.resolve(MOD_DIRECTORY_PATH, `${mod.name} ${mod.version}.json`), JSON.stringify(decoded))
    }
}
