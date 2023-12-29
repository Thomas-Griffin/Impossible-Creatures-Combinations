import fs from 'fs'
import { ModSchema } from '../types/ModSchema'
import { ROOT_DIRECTORY, SCHEMA_FILE_PATH } from '../globalConstants'

const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, 'utf8'))

async function removeModuleAndHandleError(mod: ModSchema) {
  const filePath = `${ROOT_DIRECTORY}/${mod.name} ${mod.version}.json`
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Removing ${filePath}...`)
      await fs.promises.rm(filePath)
    }
  } catch (err) {
    console.error(err)
  }
}

async function cleanup() {
  console.log('Cleaning up residual database files...')
  for (let module of schema) {
    await removeModuleAndHandleError(module)
  }
}

export default cleanup
