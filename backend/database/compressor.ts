import fs from 'fs'
import readline from 'readline'
import messagePack from 'msgpack-lite'
import { deflateSync } from 'zlib'

import { SCHEMA_FILE_PATH } from '../globalConstants'

const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'))

function compress() {
  for (let mod of schema) {
    const modFileName = `${mod.name} ${mod.version}.json`
    const readStream = fs.createReadStream(modFileName)
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    })

    rl.on('line', line => {
      try {
        const jsonObject = JSON.parse(line)
        const compressedObject = messagePack.encode(jsonObject)

        fs.open(`${mod.name} ${mod.version}.msgpack`, 'w', err => {
          if (err) {
            if (err.code === 'EEXIST') {
              console.error('file already exists')
              return
            }
            throw err
          }
        })

        fs.appendFileSync(`${mod.name} ${mod.version}.msgpack`, compressedObject)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    })

    rl.on('close', () => {
      console.log('Finished reading JSON file.')
      let compressedData = deflateSync(fs.readFileSync(`${mod.name} ${mod.version}.msgpack`))
      fs.writeFileSync(`${mod.name} ${mod.version}.msgpack.gz`, compressedData)
      console.log('Data compressed and saved.')
      fs.rmSync(`${mod.name} ${mod.version}.msgpack`)
    })
  }
}

export default compress
