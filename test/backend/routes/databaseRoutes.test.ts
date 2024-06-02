import request from 'supertest'

import {MongoClient} from 'mongodb'
import app from '../../../src/backend/app'
import {MOD_COMBINATION_TOTALS} from '../../../src/globals'

describe('Database routes', () => {
    describe('GET /database/reset', () => {
        it.skip('should reset the database', async () => {
            const mongoConnection: MongoClient = await MongoClient.connect(process.env['MONGO_URL'] as string)
            const response = await request(app).get('/database/reset')
            let totals = []
            for (const modCombinationTotal of MOD_COMBINATION_TOTALS) {
                let total = await mongoConnection
                    .db(process.env['MONGO_DB_NAME'])
                    .collection(modCombinationTotal.name + ' ' + modCombinationTotal.version)
                    .countDocuments({})
                totals.push({name: modCombinationTotal.name, version: modCombinationTotal.version, total: total})
            }
            expect(totals).toEqual(MOD_COMBINATION_TOTALS)
            expect(response.status).toEqual(200)
        }, 1000000) // timeout, about 15 minutes in milliseconds
    })
})
