import {testProcessedCombinations, testUnprocessedCombinations, totalNumberOfMods} from '../constants/global'
import type {CollectionInfo} from 'mongodb'
import {
    COMBINATIONS_COLLECTION_NAME,
    DEFAULT_MOD,
    MOD_COLLECTION_NAME,
    MOD_COMBINATION_TOTALS,
    MOD_DIRECTORY_PATH,
} from '../../../src/globals'

import fs from 'fs'
import DatabaseService from '../../../src/backend/services/databaseService'
import modSchemas from '../../../src/backend/database/modSchemas'

describe('Database service tests', () => {
    const databaseService = new DatabaseService()

    beforeEach(async () => {
        await databaseService.client.connect()
        if (fs.existsSync(MOD_DIRECTORY_PATH)) {
            fs.rmSync(MOD_DIRECTORY_PATH, {recursive: true})
        }
        await databaseService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await databaseService.client.close()
    })

    afterEach(async () => {
        await databaseService.client.connect()
        if (fs.existsSync(MOD_DIRECTORY_PATH)) {
            fs.rmSync(MOD_DIRECTORY_PATH, {recursive: true})
        }
        await databaseService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await databaseService.client.close()
    })

    describe('create database', () => {
        it('should create the correct database', async () => {
            await databaseService.createDatabase()
            // must insert at least one item for collection to show up in list
            await databaseService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .insertOne(DEFAULT_MOD)
            const databaseNames = (await databaseService.client.db('admin').admin().listDatabases()).databases.map(
                (database: {name: string, sizeOnDisk?: number, empty?: boolean}) => database.name,
            )
            expect(databaseNames).toContain(process.env['MONGO_DB_NAME'])
        })
        it('should create an empty database', async () => {
            await databaseService.createDatabase()
            const collections = await databaseService.client
                .db(process.env['MONGO_DB_NAME'])
                .listCollections()
                .toArray()
            expect(collections).toEqual([])
        })
    })
    describe('create mods collection', () => {
        it('should create only the mods collection', async () => {
            await databaseService.createDatabase()
            await databaseService.createModsCollection()
            const collections = databaseService.client.db(process.env['MONGO_DB_NAME']).listCollections()
            const collectionNames = (await collections.toArray()).map((collection: CollectionInfo) => collection.name)
            expect(collectionNames).toHaveLength(1)
            expect(collectionNames).toContain(MOD_COLLECTION_NAME)
        })
    })
    describe('create combinations collection', () => {
        it('should create the combinations collection', async () => {
            await databaseService.createDatabase()
            await databaseService.createCombinationsCollection()
            const db = databaseService.client.db(process.env['MONGO_DB_NAME'])
            const collections = db.listCollections()
            const collectionsResult = await collections.toArray()
            const collectionNames = collectionsResult.map((collection: CollectionInfo) => collection.name)
            expect(collectionNames).toContain(COMBINATIONS_COLLECTION_NAME)
            expect(collectionNames).toHaveLength(1)
        })
    })
    describe('populate mod collection with mod data', () => {
        it('should have the same number of mods in the mod collection as the total number of mods', async () => {
            await databaseService.createDatabase()
            await databaseService.createModsCollection()
            await databaseService.populateModCollectionWithModData()
            const mods = await databaseService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .find()
                .project({_id: 0})
                .toArray()
            expect(mods).toHaveLength(totalNumberOfMods)
        })
    })
    describe('populate mod collection with combinations', () => {
        it('should insert the correct number of combinations for each mod', async () => {
            await databaseService.createDatabase()
            await databaseService.createModsCollection()
            await databaseService.populateModCollectionWithModData()
            await databaseService.createCombinationsCollection()
            await databaseService.processAndSaveCombinations(modSchemas[0], testUnprocessedCombinations)
            expect(
                await databaseService.client
                    .db(process.env['MONGO_DB_NAME'])
                    .collection(COMBINATIONS_COLLECTION_NAME)
                    .find()
                    .toArray(),
            ).toHaveLength(testUnprocessedCombinations.length)
        })
        it('should populate with combinations that match the desired output', async () => {
            await databaseService.createDatabase()
            await databaseService.createModsCollection()
            await databaseService.populateModCollectionWithModData()
            await databaseService.createCombinationsCollection()
            await databaseService.processAndSaveCombinations(modSchemas[0], testUnprocessedCombinations)
            const combinations = await databaseService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .find()
                .project({_id: 0})
                .toArray()
            expect(combinations).toEqual(testProcessedCombinations)
        })
    })
    describe('get property value', () => {
        it('should return the correct value for armour', async () => {
            const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[0], [
                'attributes',
                'armour',
                1,
            ])
            expect(propertyValue).toEqual(0.3999999761581421)
        })
        it('should return the correct value for composition', async () => {
            const propertyValue = databaseService.getPropertyValue(testUnprocessedCombinations[2], ['composition', 4])
            expect(propertyValue).toEqual(2)
        })
    })
    describe('database exists', () => {
        it('should return true if the database exists', async () => {
            await databaseService.createDatabase()
            await databaseService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(MOD_COLLECTION_NAME)
                .insertOne(DEFAULT_MOD)
            const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
            expect(result).toEqual(true)
        })
        it('should return false if the database does not exist', async () => {
            const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
            expect(result).toEqual(false)
        })
    })
    describe('deleteDatabase', () => {
        it('should delete the database', async () => {
            await databaseService.createDatabase()
            await databaseService.deleteDatabase()
            const result = await databaseService.databaseExists(process.env['MONGO_DB_NAME'])
            expect(result).toEqual(false)
        })
    })
    describe('createModDirectories', () => {
        it('should create the mod directories', async () => {
            databaseService.createModDirectories()
            for (const mod of MOD_COMBINATION_TOTALS) {
                expect(fs.existsSync(`${MOD_DIRECTORY_PATH}/${mod.name}/${mod.version}`)).toEqual(true)
            }
            fs.rmSync(MOD_DIRECTORY_PATH, {force: true, recursive: true})
        })
    })
    describe('deleteModDirectories', () => {
        it('should delete the mod directories', async () => {
            databaseService.createModDirectories()
            databaseService.deleteModDirectories()
            const modDirectories = fs.existsSync(MOD_DIRECTORY_PATH)
            expect(modDirectories).toEqual(false)
        })
    })

    describe('getBodyPart', () => {
        it('should return the correct body part given index 0', async () => {
            const bodyPart = databaseService.getBodyPart(0)
            expect(bodyPart).toEqual('Innate')
        })
        it('should return the correct body part given index 1', async () => {
            const bodyPart = databaseService.getBodyPart(1)
            expect(bodyPart).toEqual('Innate')
        })
        it('should return the correct body part given index 2', async () => {
            const bodyPart = databaseService.getBodyPart(2)
            expect(bodyPart).toEqual('Head')
        })
        it('should return the correct body part given index 3', async () => {
            const bodyPart = databaseService.getBodyPart(3)
            expect(bodyPart).toEqual('Tail')
        })
        it('should return the correct body part given index 4', async () => {
            const bodyPart = databaseService.getBodyPart(4)
            expect(bodyPart).toEqual('Torso')
        })
        it('should return the correct body part given index 5', async () => {
            const bodyPart = databaseService.getBodyPart(5)
            expect(bodyPart).toEqual('Pincers')
        })
        it('should return the correct body part given index 6', async () => {
            const bodyPart = databaseService.getBodyPart(6)
            expect(bodyPart).toEqual('Wings')
        })
        it('should return the correct body part given index 7', async () => {
            const bodyPart = databaseService.getBodyPart(7)
            expect(bodyPart).toEqual('None')
        })
    })
})
