import { testMod } from '../constants/globalTestConstants'
import VisualisationsService from '../../services/visualisationsService'

const visualisationsService = new VisualisationsService()
describe('Visualisation Service', () => {
  describe('toCollectionName', () => {
    it('should return the correct collection name', () => {
      const result = visualisationsService.toCollectionName(testMod)
      expect(result).toEqual('testMod 1.0.0')
    })
  })
  describe('getResearchLevelsPerStock', () => {
    it('should return the research levels per stock', async () => {
      await visualisationsService.client.connect()
      await visualisationsService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection('Impossible Creatures 1.1')
        .insertMany([
          {
            'Research Level': 1,
            'Animal 1': 'testAnimal1',
            'Animal 2': 'testAnimal2',
          },
          {
            'Research Level': 2,
            'Animal 1': 'testAnimal3',
            'Animal 2': 'testAnimal4',
          },
          {
            'Research Level': 3,
            'Animal 1': 'testAnimal5',
            'Animal 2': 'testAnimal6',
          },
          {
            'Research Level': 4,
            'Animal 1': 'testAnimal7',
            'Animal 2': 'testAnimal8',
          },
          {
            'Research Level': 5,
            'Animal 1': 'testAnimal9',
            'Animal 2': 'testAnimal10',
          },
        ])
      const result = await visualisationsService.getResearchLevelsPerStock({
        mod: { name: 'Impossible Creatures', version: '1.1' },
      })
      expect(result).toEqual([
        {
          animal: 'testAnimal1',
          counts: {
            'Research Level 1': 1,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal10',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 1,
          },
        },
        {
          animal: 'testAnimal2',
          counts: {
            'Research Level 1': 1,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal3',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 1,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal4',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 1,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal5',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 1,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal6',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 1,
            'Research Level 4': 0,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal7',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 1,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal8',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 1,
            'Research Level 5': 0,
          },
        },
        {
          animal: 'testAnimal9',
          counts: {
            'Research Level 1': 0,
            'Research Level 2': 0,
            'Research Level 3': 0,
            'Research Level 4': 0,
            'Research Level 5': 1,
          },
        },
      ])
    })
  })
  it('should return an error if the mod is not found', async () => {
    const result = await visualisationsService.getResearchLevelsPerStock({
      mod: { name: 'fakeMod', version: '1.0.0' },
    })
    expect(result).toEqual(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('must be one of'),
          }),
        ]),
      })
    )
  })
  describe('getCoalCostDistribution', () => {
    it('should return the coal cost distribution', async () => {
      await visualisationsService.client.connect()
      await visualisationsService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection('Impossible Creatures 1.1')
        .insertMany([
          {
            Coal: 100,
            'Animal 1': 'testAnimal1',
            'Animal 2': 'testAnimal2',
          },
          {
            Coal: 200,
            'Animal 1': 'testAnimal3',
            'Animal 2': 'testAnimal4',
          },
          {
            Coal: 300,
            'Animal 1': 'testAnimal5',
            'Animal 2': 'testAnimal6',
          },
          {
            Coal: 400,
            'Animal 1': 'testAnimal7',
            'Animal 2': 'testAnimal8',
          },
          {
            Coal: 500,
            'Animal 1': 'testAnimal9',
            'Animal 2': 'testAnimal10',
          },
        ])
      const result = await visualisationsService.getCoalCostDistribution({
        mod: { name: 'Impossible Creatures', version: '1.1' },
      })
      expect(result).toEqual([
        {
          bounds: {
            lower: 100,
            upper: 100,
          },
          count: 1,
        },
        {
          bounds: {
            lower: 200,
            upper: 200,
          },
          count: 1,
        },
        {
          bounds: {
            lower: 300,
            upper: 300,
          },
          count: 1,
        },
        {
          bounds: {
            lower: 400,
            upper: 400,
          },
          count: 1,
        },
        {
          bounds: {
            lower: 500,
            upper: 500,
          },
          count: 1,
        },
      ])
    })
  })
})
