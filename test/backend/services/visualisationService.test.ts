import {COMBINATIONS_COLLECTION_NAME, DEFAULT_MOD} from '@src/globals'
import VisualisationsService from '@backend/services/visualisationsService'
import CombinationAttributeNames from '~types/CombinationAttributeNames'
import CombinationVisualisationRequestBody from '~types/CombinationVisualisationRequestBody'
import CombinationVisualisationAttributes from '~types/CombinationVisualisationAttributes'

describe('Visualisation Service', () => {
    const visualisationsService = new VisualisationsService()

    beforeEach(async () => {
        await visualisationsService.client.connect()
        await visualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await visualisationsService.client.close()
    })
    
    afterEach(async () => {
        await visualisationsService.client.connect()
        await visualisationsService.client.db(process.env['MONGO_DB_NAME']).dropDatabase()
        await visualisationsService.client.close()
    })

    describe('getAttributeChart', () => {
        it('should return an attribute chart for the specified combination attribute', async () => {
            await visualisationsService.client.connect()
            await visualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .insertMany([
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 1,
                        [CombinationAttributeNames.ANIMAL_1]: 'testAnimal1',
                        [CombinationAttributeNames.ANIMAL_2]: 'testAnimal2',
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 2,
                        'Animal 1': 'testAnimal3',
                        'Animal 2': 'testAnimal4',
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 3,
                        'Animal 1': 'testAnimal5',
                        'Animal 2': 'testAnimal6',
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 4,
                        'Animal 1': 'testAnimal7',
                        'Animal 2': 'testAnimal8',
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 5,
                        'Animal 1': 'testAnimal9',
                        'Animal 2': 'testAnimal10',
                    },
                ])
            await visualisationsService.client.close()
            const result = await visualisationsService.getAttributeChart({
                mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                attributes: {
                    x: CombinationVisualisationAttributes.RESEARCH_LEVEL,
                    y: CombinationVisualisationAttributes.NONE,
                },
            } as CombinationVisualisationRequestBody)
            expect(result).toEqual([
                {
                    text: ['1', '1', '1', '1', '1'],
                    type: 'bar',
                    x: [
                        'Research Level 1',
                        'Research Level 2',
                        'Research Level 3',
                        'Research Level 4',
                        'Research Level 5',
                    ],
                    y: [1, 1, 1, 1, 1],
                },
            ])
        })
    })

    describe('getXPerYChart', () => {
        it('should return an x per y chart for the specified combination attributes', async () => {
            await visualisationsService.client.connect()
            await visualisationsService.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .insertMany([
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 1,
                        [CombinationAttributeNames.COAL]: 11,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 2,
                        [CombinationAttributeNames.COAL]: 22,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 3,
                        [CombinationAttributeNames.COAL]: 33,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 4,
                        [CombinationAttributeNames.COAL]: 44,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 5,
                        [CombinationAttributeNames.COAL]: 55,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 5,
                        [CombinationAttributeNames.COAL]: 56,
                    },
                    {
                        Mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                        [CombinationAttributeNames.RESEARCH_LEVEL]: 5,
                        [CombinationAttributeNames.COAL]: 57,
                    },
                ])
            await visualisationsService.client.close()

            const result = await visualisationsService.getXPerYChart({
                mod: {name: DEFAULT_MOD.name, version: DEFAULT_MOD.version},
                attributes: {
                    x: CombinationVisualisationAttributes.COAL,
                    y: CombinationVisualisationAttributes.RESEARCH_LEVEL,
                },
            } as CombinationVisualisationRequestBody)
            expect(result).toEqual([
                {
                    name: 'Research Level: 1',
                    text: 'Coal 11 Research Level: 1',
                    type: 'bar',
                    x: [1],
                    y: [1],
                },
                {
                    name: 'Research Level: 2',
                    text: 'Coal 22 Research Level: 2',
                    type: 'bar',
                    x: [2],
                    y: [1],
                },
                {
                    name: 'Research Level: 3',
                    text: 'Coal 33 Research Level: 3',
                    type: 'bar',
                    x: [3],
                    y: [1],
                },
                {
                    name: 'Research Level: 4',
                    text: 'Coal 44 Research Level: 4',
                    type: 'bar',
                    x: [4],
                    y: [1],
                },
                {
                    name: 'Research Level: 5',
                    text: 'Coal 55 - 57 Research Level: 5',
                    type: 'bar',
                    x: [5],
                    y: [3],
                },
            ])
        })
    })
})
