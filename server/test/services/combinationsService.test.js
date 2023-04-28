const Service = require('../../services/combinationsService');
const config = {useTestCollection: true}
const combinationsService = new Service(config)
const testModCollectionName = 'testMod'

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
            const combinations = await combinationsService.getCombinations();
            expect(combinations).toHaveLength(3);
        });
    });

    describe('getCombinationsByAnimal1', () => {
        it('should return all combinations with animal1', async () => {
            const combinations = await combinationsService.getCombinationsByAnimal1('testAnimal1');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByAnimal2', () => {
        it('should return all combinations with animal2', async () => {
            const combinations = await combinationsService.getCombinationsByAnimal2('testAnimal2');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByResearchLevel', () => {
        it('should return all combinations with researchLevel', async () => {
            const combinations = await combinationsService.getCombinationsByResearchLevel(1);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByPower', () => {
        it('should return all combinations with power equal to 2', async () => {
            const combinations = await combinationsService.getCombinationsByPower(2);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByAirSpeed', () => {
        it('should return all combinations with air speed equal to 3', async () => {
            const combinations = await combinationsService.getCombinationsByAirSpeed(3);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByLandSpeed', () => {
        it('should return all combinations with land speed equal to 4', async () => {
            const combinations = await combinationsService.getCombinationsByLandSpeed(4);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByWaterSpeed', () => {
        it('should return all combinations with water speed equal to 5', async () => {
            const combinations = await combinationsService.getCombinationsByWaterSpeed(5);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByHealth', () => {
        it('should return all combinations with health equal to 6', async () => {
            const combinations = await combinationsService.getCombinationsByHealth(6);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsBySize', () => {
        it('should return all combinations with size equal to 7', async () => {
            const combinations = await combinationsService.getCombinationsBySize(7);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByPopulationCost', () => {
        it('should return all combinations with population cost equal to 8', async () => {
            const combinations = await combinationsService.getCombinationsByPopulationCost(8);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByEHP', () => {
        it('should return all combinations with EHP equal to 9', async () => {
            const combinations = await combinationsService.getCombinationsByEHP(9);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByMeleeDamage', () => {
        it('should return all combinations with melee damage equal to 10', async () => {
            const combinations = await combinationsService.getCombinationsByMeleeDamage(10);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsBySightRadius', () => {
        it('should return all combinations with sight radius equal to 11', async () => {
            const combinations = await combinationsService.getCombinationsBySightRadius(11);
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByFrontLegs', () => {
        it('should return all combinations with front legs', async () => {
            const combinations = await combinationsService.getCombinationsByFrontLegs('testAnimal1');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByRearLegs', () => {
        it('should return all combinations with rear legs', async () => {
            const combinations = await combinationsService.getCombinationsByRearLegs('testAnimal1');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByHead', () => {
        it('should return all combinations with head', async () => {
            const combinations = await combinationsService.getCombinationsByHead('testAnimal2');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByTail', () => {
        it('should return all combinations with tail', async () => {
            const combinations = await combinationsService.getCombinationsByTail('testAnimal2');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByTorso', () => {
        it('should return all combinations with torso', async () => {
            const combinations = await combinationsService.getCombinationsByTorso('testAnimal3');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByPincers', () => {
        it('should return all combinations with pincers', async () => {
            const combinations = await combinationsService.getCombinationsByPincers('testAnimal1');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsByWings', () => {
        it('should return all combinations with wings', async () => {
            const combinations = await combinationsService.getCombinationsByWings('testAnimal1');
            expect(combinations).toHaveLength(1);
        });
    });

    describe('getCombinationsInRange', () => {
        it('should return all combinations with power between 2 and 23 inclusive', async () => {
            const combinations = await combinationsService.getCombinationsInRange('Power', 2, 23);
            expect(combinations).toHaveLength(3);
        });
        it("should return an empty array if the property doesn't exist", async () => {
            const combinations = await combinationsService.getCombinationsInRange('test', 2, 23);
            expect(combinations).toEqual([]);
        });
        it('should return an empty array if the range is invalid', async () => {
            const combinations = await combinationsService.getCombinationsInRange('Power', 23, 2);
            expect(combinations).toEqual([]);
        });
    });

    describe('getCombinationsInRangeMultipleAttributes', () => {
        it('should return all combinations with power between 2 and 23 inclusive and health between 6 and 61 inclusive', async () => {
            const combinations = await combinationsService.getCombinationsWithFiltersAndSorting([{
                attribute: 'Power', min: 2, max: 23
            }, {attribute: 'Health', min: 6, max: 61}]);
            expect(combinations).toHaveLength(1);
        });

        it('should return all combinations with power between 2 and 23 inclusive and health between 6 and 62 inclusive', async () => {
            const combinations = await combinationsService.getCombinationsWithFiltersAndSorting([{
                attribute: 'Power', min: 2, max: 23
            }, {attribute: 'Health', min: 6, max: 62}]);
            expect(combinations).toHaveLength(2);
        });

        it('should return an empty array if the ranges are invalid', async () => {
            const combinations = await combinationsService.getCombinationsWithFiltersAndSorting([{
                attribute: 'Power', min: 23, max: 2
            }, {attribute: 'Health', min: 6, max: 26}]);
            expect(combinations).toEqual([]);
        });
    });
});


