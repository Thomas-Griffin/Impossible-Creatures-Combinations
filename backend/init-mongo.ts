import path from 'path'

process.env['MONGO_URI'] = 'mongodb://localhost:27017'

import(path.resolve('./database/combinations/decompressor')).then(module => {
  module.default
})

import(path.resolve('./database/combinations/reset')).then(module => {
  module.default
})

import(path.resolve('./database/combinations/cleanup')).then(module => {
  module.default
})
