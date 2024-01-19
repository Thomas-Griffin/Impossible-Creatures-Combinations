// import app from '../../app'
// import request from 'supertest'
// import { modCombinationTotals } from '../constants/globalTestConstants'
// import { MongoClient } from 'mongodb'

describe('Database routes', () => {
    describe('GET /database/reset', () => {
        it('should reset the database', async () => {
            // const mongoConnection: MongoClient = await MongoClient.connect(process.env['MONGO_URI'] as string)
            // const response = await request(app).get('/database/reset')
            // let totals = []
            // for (const modCombinationTotal of modCombinationTotals) {
            //   let total = await mongoConnection
            //     .db(process.env['MONGO_DB_NAME'])
            //     .collection(modCombinationTotal.name + ' ' + modCombinationTotal.version)
            //     .countDocuments({})
            //   totals.push({ name: modCombinationTotal.name, version: modCombinationTotal.version, total: total })
            // }
            // expect(totals).toEqual(modCombinationTotals)
            // expect(response.status).toEqual(200)
        }, 1000000); // timeout, about 15 minutes in milliseconds
    });
});
