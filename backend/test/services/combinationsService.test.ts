import CombinationService from '../../services/combinationsService'
import { testMod, testModName } from '../constants/globalTestConstants'
import Joi from 'joi'
import Mod from '../../types/Mod'
import SortingType from '../../types/SortingType'
import combinationsErrors from '../../errors/combinationsErrors'

const combinationsService = new CombinationService()
describe('CombinationsService', () => {
  beforeEach(async () => {
    await combinationsService.client.connect()
    await combinationsService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).drop()
    await combinationsService.client
      .db(process.env['MONGO_DB_NAME'])
      .collection(testModName)
      .insertMany([
        {
          'Animal 1': 'testAnimal1',
          'Animal 2': 'testAnimal2',
          'Research Level': 1,
          Power: 2,
          'Air Speed': 3,
          'Land Speed': 4,
          'Water Speed': 5,
          Health: 6,
          Size: 7,
          'Population Cost': 8,
          EHP: 9,
          'Melee Damage': 10,
          'Sight Radius': 11,
          'Front Legs': 'testAnimal1',
          'Rear Legs': 'testAnimal1',
          Head: 'testAnimal2',
          Tail: 'testAnimal2',
          Torso: 'testAnimal2',
          Pincers: 'testAnimal1',
          Wings: 'testAnimal1',
        },
        {
          'Animal 1': 'testAnimal3',
          'Animal 2': 'testAnimal4',
          'Research Level': 2,
          Power: 22,
          'Air Speed': 32,
          'Land Speed': 42,
          'Water Speed': 52,
          Health: 62,
          Size: 72,
          'Population Cost': 82,
          EHP: 92,
          'Melee Damage': 102,
          'Sight Radius': 112,
          'Front Legs': 'testAnimal3',
          'Rear Legs': 'testAnimal4',
          Head: 'testAnimal3',
          Tail: 'testAnimal3',
          Torso: 'testAnimal3',
          Pincers: 'testAnimal4',
          Wings: 'testAnimal4',
        },
        {
          'Animal 1': 'testAnimal5',
          'Animal 2': 'testAnimal6',
          'Research Level': 3,
          Power: 23,
          'Air Speed': 33,
          'Land Speed': 43,
          'Water Speed': 53,
          Health: 63,
          Size: 73,
          'Population Cost': 83,
          EHP: 93,
          'Melee Damage': 103,
          'Sight Radius': 113,
          'Front Legs': 'testAnimal5',
          'Rear Legs': 'testAnimal5',
          Head: 'testAnimal6',
          Tail: 'testAnimal6',
          Torso: 'testAnimal6',
          Pincers: 'testAnimal5',
          Wings: 'testAnimal5',
        },
      ])
    return await combinationsService.client.close()
  })
  afterEach(async () => {
    await combinationsService.client.connect()
    await combinationsService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).drop()
    return await combinationsService.client.close()
  })
  afterAll(async () => {
    await combinationsService.client.connect()
    await combinationsService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).drop()
    return await combinationsService.client.close()
  })

  describe('getCombinations', () => {
    it('should return all combinations', async () => {
      let body = {
        mod: testMod,
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getCombinations(body, 1, 10)
      expect(combinations).toHaveLength(3)
    })
    it("should return an error if the mod doesn't exist", async () => {
      let body: {
        mod: Mod
      } = {
        mod: {
          name: 'fakeMod',
          version: '1.0.0',
          columns: [],
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getCombinations(body, 1, 10)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should return an error if pageNumber is less than 1', async function () {
      let body = {
        mod: testMod,
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getCombinations(body, 0, 10)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should return an error if nPerPage is less than 1', async function () {
      let body = {
        mod: testMod,
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getCombinations(body, 1, 0)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should return an error if filters is not an array of objects', async function () {
      let body = {
        mod: testMod,
        filters: ['test'],
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getCombinations(body, 1, 10)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
  })
  describe('getTotalCombinations', () => {
    it('should return the total number of combinations', async () => {
      let body = {
        mod: testMod,
        filters: {},
        sorting: {
          column: 'Research Level',
          order: SortingType.Ascending,
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toBe(3)
    })
    it("should return an error if the mod doesn't exist", async () => {
      let body = {
        mod: {
          name: 'fakeMod',
          version: '1.0.0',
          columns: [],
        },
        filters: {},
        sorting: {
          column: 'Research Level',
          order: SortingType.Ascending,
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toEqual(
        expect.objectContaining({
          details: expect.arrayContaining([
            expect.objectContaining({
              message: expect.stringContaining('must be one of'),
            }),
          ]),
        })
      )
    })
    it('should return an error if filters is not an object', async () => {
      let body = {
        mod: testMod,
        filters: ['test'],
        sorting: {
          column: 'Research Level',
          order: SortingType.Ascending,
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should still return a result if sorting is undefined', async () => {
      let body = {
        mod: testMod,
        filters: {},
        sorting: undefined,
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toEqual(3)
    })
    it('should still return a result if sorting.order is undefined', async () => {
      let body = {
        mod: testMod,
        filters: {},
        sorting: {
          column: 'Research Level',
          order: undefined,
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toEqual(3)
    })
    it('should return mod missing error if mod is not provided', async () => {
      let body = {
        mod: undefined,
        filters: {},
        sorting: {
          column: 'Research Level',
          order: SortingType.Ascending,
        },
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getTotalCombinations(body)
      expect(combinations).toEqual(combinationsErrors.ModMissingError)
    })
  })
  describe('getAttributeMinMax', () => {
    it('should return the min and max values for an attribute', async () => {
      let body = {
        mod: testMod,
        attribute: 'Research Level',
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getAttributeMinMax(body)
      expect(combinations).toEqual({ min: 1, max: 3 })
    })
    it("should return an error if the mod doesn't exist", async () => {
      let body = {
        mod: {
          name: 'fakeMod',
          version: '1.0.0',
          columns: [],
        },
        attribute: 'Research Level',
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getAttributeMinMax(body)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should return an error if attribute is not a string', async () => {
      let body = {
        mod: testMod,
        attribute: 1,
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getAttributeMinMax(body)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
    it('should return mod missing error if mod is not provided', async () => {
      let body = {
        mod: undefined,
        attribute: 'Research Level',
      }
      await combinationsService.client.connect()
      const combinations = await combinationsService.getAttributeMinMax(body)
      expect(combinations).toBeInstanceOf(Joi.ValidationError)
    })
  })
})
