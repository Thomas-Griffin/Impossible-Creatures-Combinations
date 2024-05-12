import Mod from 'src/types/Mod';
import {ModSchema} from 'src/types/ModSchema';
import UnprocessedCombination from 'src/types/UnprocessedCombination';
import ProcessedCombination from 'src/types/ProcessedCombination.js';
import {MOD_COMBINATION_TOTALS} from '../../globalConstants';
import {ModColumnType} from '../../src/types/ModColumnType';

export const testMod: Mod = {
    name: 'testMod',
    version: '1.0.0',
    columns: [
        {
            label: 'Animal 1',
            type: ModColumnType.STRING,
        },
        {
            label: 'Animal 2',
            type: ModColumnType.STRING,
        },
        {
            label: 'Research Level',
            type: ModColumnType.INTEGER,
            min: 1,
            max: 3,
        },
        {
            label: 'Coal',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Electricity',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Health',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'EHP',
            type: ModColumnType.GENERATED,
        },
        {
            label: 'Size',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Population Size',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Melee Damage',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Defence',
            type: ModColumnType.PERCENTAGE,
        },
        {
            label: 'Air Speed',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Land Speed',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Water Speed',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Sight Radius',
            type: ModColumnType.FLOAT,
        },
        {
            label: 'Front Legs',
            type: ModColumnType.STRING,
        },
        {
            label: 'Rear Legs',
            type: ModColumnType.STRING,
        },
        {
            label: 'Head',
            type: ModColumnType.STRING,
        },
        {
            label: 'Tail',
            type: ModColumnType.STRING,
        },
        {
            label: 'Torso',
            type: ModColumnType.STRING,
        },
        {
            label: 'Pincers',
            type: ModColumnType.STRING,
        },
        {
            label: 'Wings',
            type: ModColumnType.STRING,
        },
        {
            label: 'Abilities',
            type: ModColumnType.ARRAY,
        },
    ],
};

export const testModSchema: ModSchema = {
    name: 'testMod',
    version: '1.0.0',
    columns: [
        {
            label: 'Animal 1',
            type: ModColumnType.STRING,
            format: true,
            path: ['stock_1'],
            description: "The first animal in the creature's composition.",
        },
        {
            label: 'Animal 2',
            type: ModColumnType.STRING,
            format: true,
            path: ['stock_2'],
            description: "The second animal in the creature's composition.",
        },
        {
            label: 'Research Level',
            type: ModColumnType.INTEGER,
            path: ['attributes', 'creature_rank', 1],
            description: 'The research level required to build the creature.',
        },
        {
            label: 'Coal',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'cost', 1],
            description: 'The amount of coal required to build the creature.',
        },
        {
            label: 'Electricity',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'costrenew', 1],
            description: 'The amount of electricity required to build the creature.',
        },
        {
            label: 'Health',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'health_val', 1],
            description: "The creature's health.",
        },
        {
            label: 'EHP',
            type: ModColumnType.GENERATED,
            description: "The creature's effective hit points.",
        },
        {
            label: 'Size',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'size', 1],
        },
        {
            label: 'Population Size',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'popsize', 1],
            description: "The creature's population size.",
        },
        {
            label: 'Melee Damage',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'damage_val', 1],
            description: "The creature's total melee damage.",
        },
        {
            label: 'Defence',
            type: ModColumnType.PERCENTAGE,
            decimal_places: 1,
            path: ['attributes', 'armour', 1],
            description: "The creature's total defence value",
        },
        {
            label: 'Air Speed',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'airspeed_val', 1],
            description: "The creature's air speed.",
        },
        {
            label: 'Land Speed',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'landspeed_val', 1],
            description: "The creature's land speed.",
        },
        {
            label: 'Water Speed',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'waterspeed_val', 1],
            description: "The creature's water speed.",
        },
        {
            label: 'Sight Radius',
            type: ModColumnType.FLOAT,
            decimal_places: 1,
            path: ['attributes', 'sight_radius1', 1],
            description: "The creature's sight radius.",
        },
        {
            label: 'Front Legs',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 0],
            description: "The animal from which the creature's front legs are composed.",
        },
        {
            label: 'Rear Legs',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 1],
            description: "The animal from which the creature's rear legs are composed.",
        },
        {
            label: 'Head',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 2],
            description: "The animal from which the creature's head is composed.",
        },
        {
            label: 'Tail',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 3],
            description: "The animal from which the creature's tail is composed.",
        },
        {
            label: 'Torso',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 4],
            description: "The animal from which the creature's torso is composed.",
        },
        {
            label: 'Pincers',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 5],
            description: "The animal from which the creature's pincers are composed.",
        },
        {
            label: 'Wings',
            type: ModColumnType.STRING,
            format: true,
            path: ['composition', 6],
            description: "The animal from which the creature's wings are composed.",
        },
        {
            label: 'Abilities',
            type: ModColumnType.ARRAY,
        },
    ],
};

export const testUnprocessedCombinations: UnprocessedCombination[] = [
    {
        attributes: {
            armour: [1, 0.3999999761581421],
            armour_rating: [-1, 4],
            armour_val: [-1, 40],
            buildtime: [-1, 10],
            can_dig: [2, 1],
            constructionticks: [-1, 32],
            cost: [-1, 78.66000366210938],
            costrenew: [-1, 25],
            creature_rank: [-1, 1],
            damage_rating: [-1, 3],
            damage_val: [-1, 10],
            health_rating: [-1, 1],
            health_val: [-1, 30],
            hitpoints: [1, 30],
            is_immune: [0, 1],
            is_land: [1, 1],
            land_legs_counted: [1, 2],
            landspeed_rating: [-1, 2],
            landspeed_val: [-1, 26],
            lefthalf_name: [1, 24002],
            melee2_damage: [2, 5],
            melee2_dmgtype: [2, 0],
            melee2_longdesc: [2, 5017],
            melee2_name: [2, 5015],
            melee2_rate: [2, 1.25],
            melee2_shortdesc: [2, 5016],
            melee4_damage: [4, 5],
            melee4_dmgtype: [4, 0],
            melee4_longdesc: [4, 5012],
            melee4_name: [4, 5010],
            melee4_rate: [4, 1.25],
            melee4_shortdesc: [4, 5011],
            melee_damage: [0, 10],
            popsize: [-1, 1],
            righthalf_name: [1, 24007],
            sight_radius1: [0, 20],
            sightradius_rating: [-1, 1],
            sightradius_val: [-1, 20],
            size: [1, 1],
            size_rating: [-1, 1],
            size_val: [-1, 1],
            speed_max: [0, 26],
        },
        composition: [1, 1, 1, 1, 1, 1, 1],
        stock_1: 'ant',
        stock_2: 'archerfish',
    },
    {
        attributes: {
            armour: [1, 0.06000000238418579],
            armour_rating: [-1, 1],
            armour_val: [-1, 6],
            buildtime: [-1, 10],
            constructionticks: [-1, 48],
            cost: [-1, 66.76000213623047],
            costrenew: [-1, 55],
            creature_rank: [-1, 2],
            damage_rating: [-1, 1],
            damage_val: [-1, 2],
            health_rating: [-1, 1],
            health_val: [-1, 18],
            hitpoints: [1, 18],
            is_immune: [0, 1],
            is_swimmer: [1, 1],
            lefthalf_name: [1, 24002],
            melee4_damage: [4, 2],
            melee4_dmgtype: [4, 0],
            melee4_longdesc: [4, 5002],
            melee4_name: [4, 5000],
            melee4_rate: [4, 1.25],
            melee4_shortdesc: [4, 5001],
            melee_damage: [0, 2],
            popsize: [-1, 1],
            range4_damage: [4, 3],
            range4_damage_rating: [-1, 1],
            range4_damage_val: [-1, 3],
            range4_dmgtype: [4, 0],
            range4_longdesc: [4, 5007],
            range4_max: [4, 20],
            range4_max_rating: [-1, 4],
            range4_max_val: [-1, 20],
            range4_min: [4, 7],
            range4_name: [4, 5005],
            range4_rate: [4, 1.25],
            range4_shortdesc: [4, 5006],
            range4_special: [4, 2],
            righthalf_name: [1, 24007],
            sight_radius1: [0, 30],
            sightradius_rating: [-1, 2],
            sightradius_val: [-1, 30],
            size: [1, 1],
            size_rating: [-1, 1],
            size_val: [-1, 1],
            waterspeed_max: [0, 30],
            waterspeed_rating: [-1, 4],
            waterspeed_val: [-1, 30],
        },
        composition: [2, 2, 2, 2, 2, 2, 2],
        stock_1: 'ant',
        stock_2: 'archerfish',
    },
    {
        attributes: {
            armour: [1, 0.2499999850988388],
            armour_rating: [-1, 3],
            armour_val: [-1, 25],
            buildtime: [-1, 10],
            can_dig: [2, 1],
            constructionticks: [-1, 48],
            cost: [-1, 64.62000274658203],
            costrenew: [-1, 25],
            creature_rank: [-1, 2],
            damage_rating: [-1, 3],
            damage_val: [-1, 10],
            health_rating: [-1, 1],
            health_val: [-1, 30],
            hitpoints: [1, 30],
            is_immune: [0, 1],
            is_land: [1, 1],
            is_swimmer: [1, 1],
            land_legs_counted: [1, 2],
            landspeed_rating: [-1, 1],
            landspeed_val: [-1, 20.799999237060547],
            lefthalf_name: [1, 24002],
            melee2_damage: [2, 5],
            melee2_dmgtype: [2, 0],
            melee2_longdesc: [2, 5017],
            melee2_name: [2, 5015],
            melee2_rate: [2, 1.25],
            melee2_shortdesc: [2, 5016],
            melee4_damage: [4, 5],
            melee4_dmgtype: [4, 0],
            melee4_longdesc: [4, 5012],
            melee4_name: [4, 5010],
            melee4_rate: [4, 1.25],
            melee4_shortdesc: [4, 5011],
            melee_damage: [0, 10],
            popsize: [-1, 1],
            righthalf_name: [1, 24007],
            sight_radius1: [0, 20],
            sightradius_rating: [-1, 1],
            sightradius_val: [-1, 20],
            size: [1, 1],
            size_rating: [-1, 1],
            size_val: [-1, 1],
            speed_max: [0, 20.799999237060547],
            waterspeed_max: [0, 10],
            waterspeed_rating: [-1, 4],
            waterspeed_val: [-1, 10],
        },
        composition: [1, 1, 1, 1, 2, 2, 2],
        stock_1: 'ant',
        stock_2: 'archerfish',
    },
];
export const testProcessedCombinations: ProcessedCombination[] = [
    {
        Abilities: [
            {
                ability: 'Digging',
                source: 'Head',
            },
            {
                ability: 'Immunity',
                source: 'Innate',
            },
        ],
        'Air Speed': 0,
        'Animal 1': 'Ant',
        'Animal 2': 'Archerfish',
        Coal: 78.7,
        Defence: 40,
        EHP: 50,
        Electricity: 25,
        'Front Legs': 'Ant',
        Head: 'Ant',
        Health: 30,
        'Land Speed': 26,
        'Melee Damage': 10,
        Pincers: 'Ant',
        'Population Size': 1,
        Power: 0,
        'Rear Legs': 'Ant',
        'Research Level': 1,
        SDT: 5,
        'Sight Radius': 20,
        Size: 1,
        Tail: 'Ant',
        Torso: 'Ant',
        'Water Speed': 0,
        Wings: 'Ant',
    },
    {
        Abilities: [
            {
                ability: 'Immunity',
                source: 'Innate',
            },
        ],
        'Air Speed': 0,
        'Animal 1': 'Ant',
        'Animal 2': 'Archerfish',
        Coal: 66.8,
        Defence: 6,
        EHP: 19.1,
        Electricity: 55,
        'Front Legs': 'Archerfish',
        Head: 'Archerfish',
        Health: 18,
        'Land Speed': 0,
        'Melee Damage': 2,
        Pincers: 'Archerfish',
        'Population Size': 1,
        Power: 0,
        'Rear Legs': 'Archerfish',
        'Research Level': 2,
        SDT: 9.6,
        'Sight Radius': 30,
        Size: 1,
        Tail: 'Archerfish',
        Torso: 'Archerfish',
        'Water Speed': 30,
        Wings: 'Archerfish',
    },
    {
        Abilities: [
            {
                ability: 'Digging',
                source: 'Head',
            },
            {
                ability: 'Immunity',
                source: 'Innate',
            },
        ],
        'Air Speed': 0,
        'Animal 1': 'Ant',
        'Animal 2': 'Archerfish',
        Coal: 64.6,
        Defence: 25,
        EHP: 40,
        Electricity: 25,
        'Front Legs': 'Ant',
        Head: 'Ant',
        Health: 30,
        'Land Speed': 20.8,
        'Melee Damage': 10,
        Pincers: 'Archerfish',
        'Population Size': 1,
        Power: 0,
        'Rear Legs': 'Ant',
        'Research Level': 2,
        SDT: 4,
        'Sight Radius': 20,
        Size: 1,
        Tail: 'Ant',
        Torso: 'Archerfish',
        'Water Speed': 10,
        Wings: 'Archerfish',
    },
];

export const testModName = `${testMod.name} ${testMod.version}`;

export const testModsCollectionName = 'mods';

export const testMods: Mod[] = [
    {
        name: 'test1',
        version: '1.0.1',
    },
    {
        name: 'test2',
        version: '1.0.2',
    },
    {
        name: 'test3',
        version: '1.0.3',
    },
];

export const totalNumberOfMods = MOD_COMBINATION_TOTALS.length;
