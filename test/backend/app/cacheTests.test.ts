import request from 'supertest'
import app from '../../../src/backend/app'

describe('Server Caching', () => {
    it('should cache the mods', async () => {
        const start1 = Date.now()
        const response1 = await request(app).get('/mods')
        const end1 = Date.now()
        const time1 = end1 - start1
        expect(response1.status).toEqual(200)
        const start2 = Date.now()
        const response2 = await request(app).get('/mods')
        const end2 = Date.now()
        const time2 = end2 - start2
        expect(response2.status).toEqual(200)
        expect(time2).toBeLessThan(time1)
    })
})
