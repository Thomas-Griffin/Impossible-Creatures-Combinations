import fs from 'fs'

import { SCHEMA_FILE_PATH } from '../../globalConstants'

const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'))

console.log('Cleaning up...')
for (let mod of schema) {
  console.log(`Removing ${mod.name} ${mod.version}.json...`)
  fs.rm(`./database/combinations/${mod.name} ${mod.version}.json`, {}, err => {
    if (err) {
      console.error(err)
    }
  })
}
