import fs from 'fs'
import path from 'path'
import messagePack from 'msgpack-lite'
import { unzipSync } from 'zlib'
import { COMPRESSED_DATA_FILE_EXTENSION, ROOT_DIRECTORY, SCHEMA_FILE_PATH } from '../globalConstants'

const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'))

function decompress() {
  for (let mod of schema) {
    console.log(
      `Decompressing ${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION} to JSON file at ${path.resolve(
        ROOT_DIRECTORY,
        `${mod.name} ${mod.version}.json`
      )}`
    )
    const modFileName = `${mod.name} ${mod.version}${COMPRESSED_DATA_FILE_EXTENSION}`
    const modFilePath = path.resolve(ROOT_DIRECTORY, `${modFileName}`)
    const compressedData = fs.readFileSync(modFilePath)
    const unzippedData = unzipSync(compressedData)
    const decoded = messagePack.decode(unzippedData)
    fs.writeFileSync(path.resolve(ROOT_DIRECTORY, `${mod.name} ${mod.version}.json`), JSON.stringify(decoded))
  }
}

export default decompress
