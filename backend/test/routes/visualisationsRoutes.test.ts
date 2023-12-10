import app from '../../app'
import request from 'supertest'
import VisualisationsService from '../../services/visualisationsService'
import { testModsCollectionName } from '../constants/globalTestConstants'

const testVisualisationsService = new VisualisationsService()
describe('Visualisations routes', () => {
  afterEach(async () => {
    await testVisualisationsService.client.connect()
    await testVisualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    return await testVisualisationsService.client.close()
  })

  describe('POST /research-levels-per-stock', () => {
    it('should return the correct values', async () => {
      await testVisualisationsService.client.connect()
      await testVisualisationsService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(testModsCollectionName)
        .insertMany([
          {
            name: 'Impossible Creatures',
            version: '1.1',
          },
        ])
      await testVisualisationsService.client
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
      const response = await request(app)
        .post('/visualisations/research-levels-per-stock')
        .send({
          mod: {
            name: 'Impossible Creatures',
            version: '1.1',
          },
        })
      expect(response.status).toEqual(200)
      expect(response.body).toEqual([
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
})
