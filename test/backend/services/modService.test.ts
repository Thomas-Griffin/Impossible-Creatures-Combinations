import ModService from '../../../src/backend/services/modService'
import {MOD_COLLECTION_NAME} from '../../../src/globals'
import mods from '../../../src/backend/database/mods'
import Mod from '../../../src/types/Mod'

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
