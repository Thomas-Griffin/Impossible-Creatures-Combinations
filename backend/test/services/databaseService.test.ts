import DatabaseService from '../../services/databaseService'

import {
  testMod,
  testModName,
  testModSchema,
  testModsCollectionName,
  testProcessedCombinations,
  testUnprocessedCombinations,
  totalNumberOfMods,
} from '../constants/globalTestConstants'
import { CollectionInfo } from 'mongodb'
import { MOD_COLLECTION_NAME } from '../../globalConstants'
import * as process from 'process'

let databaseService = new DatabaseService()
describe('Database service tests', () => {
  beforeEach(async () => {
    await databaseService.client.connect()
  })
  afterEach(async () => {
    await databaseService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
    await databaseService.client.close()
  })

  describe('create database', () => {
    it('should create the correct database', async () => {
      await databaseService.createDatabase()
      await databaseService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).insertOne(testMod) // must insert something for collection to show up in list
      const databaseNames = (await databaseService.client.db('admin').admin().listDatabases()).databases.map(
        database => database.name
      )
      expect(databaseNames).toContain(process.env['MONGO_DB_NAME'])
    })
    it('should create an empty database', async () => {
      await databaseService.createDatabase()
      const collections = await databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections().toArray()
      expect(collections).toEqual([])
    })
  })
  describe('create mods collection', () => {
    it('should create only the mods collection', async () => {
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      const collections = await databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections().toArray()
      const collectionNames = collections.map((collection: CollectionInfo) => collection.name)
      expect(collectionNames).toHaveLength(1)
      expect(collectionNames).toContain(MOD_COLLECTION_NAME)
    })
  })
  describe('create mod collections', () => {
    it('should create every required mod collection', async () => {
      await databaseService.createDatabase()
      await databaseService.createModCollections()
      const collections = await databaseService.client
        .db(process.env['MONGO_DB_NAME'])
        .listCollections({}, { nameOnly: true })
        .toArray()
      expect(collections).toHaveLength(totalNumberOfMods)
    })
  })
  describe('populate mod collection with mod data', () => {
    it('should have the same number of mods in the mod collection as the total number of mods', async () => {
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      const mods = await databaseService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(testModsCollectionName)
        .find()
        .toArray()
      expect(mods).toHaveLength(totalNumberOfMods)
    })
  })
  describe('populate mod collection with combinations', () => {
    it('should insert the correct number of combinations for each mod', async () => {
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      await databaseService.createModCollections()
      await databaseService.populateModCollectionWithCombinations(testModSchema, testUnprocessedCombinations)
      expect(
        await databaseService.client.db(process.env['MONGO_DB_NAME']).collection(testModName).find().toArray()
      ).toHaveLength(testUnprocessedCombinations.length)
    })
    it('should populate with combinations that match the desired output', async () => {
      await databaseService.createDatabase()
      await databaseService.createModsCollection()
      await databaseService.populateModCollectionWithModData()
      await databaseService.createModCollections()
      await databaseService.populateModCollectionWithCombinations(testModSchema, testUnprocessedCombinations)
      const combinations = await databaseService.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(testModName)
        .find()
        .project({ _id: 0 })
        .toArray()
      expect(combinations).toEqual(testProcessedCombinations)
    })
  })
  describe('get property value', () => {
    it('should return the correct value for armour', () => {
      const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[0], [
        'attributes',
        'armour',
        1,
      ])
      expect(propertyValue).toEqual(0.3999999761581421)
    })
    it('should return the correct value for composition', () => {
      const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[2], ['composition', 4])
      expect(propertyValue).toEqual(2)
    })
  })
})
