import ModService from '../../services/modService'
import { testMods, testModsCollectionName } from '../constants/globalTestConstants'
import Mod from '../../types/Mod'

const testModService: ModService = new ModService()

describe('ModService', () => {
  beforeEach(async () => {
    await testModService.client.connect()
    await testModService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    await testModService.client
      .db(process.env['MONGO_DB_NAME'])
      .collection(testModsCollectionName)
      .insertMany(testMods, { forceServerObjectId: true })
    return await testModService.client.close()
  })
  afterEach(async () => {
    await testModService.client.connect()
    await testModService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    return await testModService.client.close()
  })
  afterAll(async () => {
    await testModService.client.connect()
    await testModService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    return await testModService.client.close()
  })

  describe('getMods', () => {
    it('should return all mods', async () => {
      const mods: Mod[] = await testModService.getMods()
      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(mods).toEqual(testMods)
    })
  })
})
