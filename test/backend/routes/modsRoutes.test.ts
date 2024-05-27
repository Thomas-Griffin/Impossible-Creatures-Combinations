import request from 'supertest'
import ModService from '@backend/services/modService'
import app from '@backend/app'
import {DEFAULT_MOD, MOD_COLLECTION_NAME} from '@src/globals'
import mods from '@backend/database/mods'

describe('Mods routes', () => {
    const modService = new ModService()

    beforeEach(async () => {
        await modService.client.connect()
        await modService.client
            .db(process.env['MONGO_DB_NAME'])
            .collection(MOD_COLLECTION_NAME)
            .insertMany(mods, {forceServerObjectId: true})
        return await modService.client.close()
    })

    afterEach(async () => {
        await modService.client.connect()
        await modService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        return await modService.client.close()
    })

    describe('GET /mods/name/:name', () => {
        it('should return a mod by name', async () => {
            await modService.client.connect()
            const response = await request(app).get(`/mods/${DEFAULT_MOD.name}`)
            expect(response.status).toEqual(200)
            expect(response.body).toHaveLength(1)
        })
    })

    describe('GET /mods', () => {
        it('should return all mods', async () => {
            await modService.client.connect()
            const response = await request(app).get('/mods')
            expect(response.status).toEqual(200)
            expect(response.body).toEqual(mods)
        })
    })
})
