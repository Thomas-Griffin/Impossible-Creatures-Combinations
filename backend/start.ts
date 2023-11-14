import app from './app'
import * as process from 'process'

const PORT = 3000

if (process.env['environment'] === undefined) {
  console.error('Environment not set')
  process.exit(1)
} else {
  process.env['MONGO_URI'] = 'mongodb://localhost:27017'
  process.env['MONGO_DB_NAME'] = `combinations-${process.env['environment']}`
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
