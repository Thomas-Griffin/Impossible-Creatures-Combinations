import ModService from '../../services/modService'
import { testMods, testModsCollectionName } from '../constants/globalTestConstants'
import Mod from '../../types/Mod'

const testModService: ModService = new ModService()
console.log(testMods)
describe('ModService', () => {
  beforeEach(async () => {
    await testModService.client.connect()
    await testModService.client
      .db(process.env['MONGO_DB_NAME'])
      .collection(testModsCollectionName)
      .insertMany(testMods, { forceServerObjectId: true })
  })

  afterEach(async () => {
    await testModService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    await testModService.client.close()
  })

  describe('getMods', () => {
    it('should return all mods', async () => {
      const mods: Mod[] = await testModService.getMods()
      console.log(mods)
      console.log(testMods)
      expect(mods).toEqual(testMods)
    })
  })
})
