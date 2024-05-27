import ModService from '@backend/services/modService'
import {MOD_COLLECTION_NAME} from '@src/globals'
import mods from '@backend/database/mods'
import Mod from '~types/Mod'

describe('ModService', () => {
    const modService = new ModService()

    beforeEach(async () => {
        await modService.client.connect()
        await modService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
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
    afterAll(async () => {
        await modService.client.connect()
        await modService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        return await modService.client.close()
    })

    describe('getMods', () => {
        it('should return all mods', async () => {
            const returned: Mod[] = await modService.getMods()
            expect(returned).toEqual(mods)
        })
    })
})
