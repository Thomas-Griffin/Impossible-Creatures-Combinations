const Service = require('../../services/combinationsService');
const config = {useTestCollection: true}
const combinationsService = new Service(config)
const {testMod, testModCollectionName} = require('../constants/globalTestConstants')

describe('CombinationsService', () => {
    beforeEach(async () => {
        await combinationsService.connect();
        await combinationsService.db.collection(testModCollectionName).insertMany([{
            "Animal 1": "testAnimal1",
            "Animal 2": "testAnimal2",
            "Research Level": 1,
            "Power": 2,
            "Air Speed": 3,
            "Land Speed": 4,
            "Water Speed": 5,
            "Health": 6,
            "Size": 7,
            "Population Cost": 8,
            "EHP": 9,
            "Melee Damage": 10,
            "Sight Radius": 11,
            "Front Legs": "testAnimal1",
            "Rear Legs": "testAnimal1",
            "Head": "testAnimal2",
            "Tail": "testAnimal2",
            "Torso": "testAnimal2",
            "Pincers": "testAnimal1",
            "Wings": "testAnimal1",
        }, {
            "Animal 1": "testAnimal3",
            "Animal 2": "testAnimal4",
            "Research Level": 2,
            "Power": 22,
            "Air Speed": 32,
            "Land Speed": 42,
            "Water Speed": 52,
            "Health": 62,
            "Size": 72,
            "Population Cost": 82,
            "EHP": 92,
            "Melee Damage": 102,
            "Sight Radius": 112,
            "Front Legs": "testAnimal3",
            "Rear Legs": "testAnimal4",
            "Head": "testAnimal3",
            "Tail": "testAnimal3",
            "Torso": "testAnimal3",
            "Pincers": "testAnimal4",
            "Wings": "testAnimal4",
        }, {
            "Animal 1": "testAnimal5",
            "Animal 2": "testAnimal6",
            "Research Level": 3,
            "Power": 23,
            "Air Speed": 33,
            "Land Speed": 43,
            "Water Speed": 53,
            "Health": 63,
            "Size": 73,
            "Population Cost": 83,
            "EHP": 93,
            "Melee Damage": 103,
            "Sight Radius": 113,
            "Front Legs": "testAnimal5",
            "Rear Legs": "testAnimal5",
            "Head": "testAnimal6",
            "Tail": "testAnimal6",
            "Torso": "testAnimal6",
            "Pincers": "testAnimal5",
            "Wings": "testAnimal5",
        }]);
    });
    afterEach(async () => {
        await combinationsService.db.collection(testModCollectionName).drop();
    });

    afterAll(async () => {
        await combinationsService.client.close();
    });


    describe('getCombinations', () => {
        it('should return all combinations', async () => {
            let body = {
                mod: testMod,
            }
            const combinations = await combinationsService.getCombinations(body);
            expect(combinations).toHaveLength(3);
        });
    });
});


