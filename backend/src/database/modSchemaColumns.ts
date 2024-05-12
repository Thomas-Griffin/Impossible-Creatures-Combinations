import {ModSchemaColumn} from '../types/ModSchemaColumn';

export const ANIMAL1: ModSchemaColumn = {
    label: 'Animal 1',
    type: 'string',
    format: true,
    path: ['stock_1'],
    description: "The first animal in the creature's composition.",
};

export const ANIMAL2: ModSchemaColumn = {
    label: 'Animal 2',
    type: 'string',
    format: true,
    path: ['stock_2'],
    description: "The second animal in the creature's composition.",
};

export const RESEARCH_LEVEL: ModSchemaColumn = {
    label: 'Research Level',
    type: 'integer',
    path: ['attributes', 'creature_rank', 1],
    description: 'The research level required to build the creature.',
};

export const COAL: ModSchemaColumn = {
    label: 'Coal',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'cost', 1],
    description: 'The amount of coal required to build the creature.',
};

export const ELECTRICITY: ModSchemaColumn = {
    label: 'Electricity',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'costrenew', 1],
    description: 'The amount of electricity required to build the creature.',
};

export const ELECTRICITY_TELLURIAN: ModSchemaColumn = {
    label: 'Electricity',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'costRenew', 1],
    description: 'The amount of electricity required to build the creature.',
};

export const HEALTH: ModSchemaColumn = {
    label: 'Health',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'health_val', 1],
    description: "The creature's health.",
};

export const EHP: ModSchemaColumn = {
    label: 'EHP',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'ehp', 1],
    description: "The creature's effective hit points.",
};

export const GENERATED_EHP: ModSchemaColumn = {
    label: 'EHP',
    type: 'generated',
    description: "The creature's effective hit points.",
};

export const SDT: ModSchemaColumn = {
    label: 'SDT',
    type: 'generated',
    description: "The creature's self-destruction time.",
};

export const SIZE: ModSchemaColumn = {
    label: 'Size',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'size', 1],
};

export const POPULATION_SIZE: ModSchemaColumn = {
    label: 'Population Size',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'popsize', 1],
    description: "The creature's population size.",
};

export const MELEE_DAMAGE: ModSchemaColumn = {
    label: 'Melee Damage',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'damage_val', 1],
    description: "The creature's total melee damage.",
};

export const DEFENCE: ModSchemaColumn = {
    label: 'Defence',
    type: 'percentage',
    decimal_places: 1,
    path: ['attributes', 'armour', 1],
    description: "The creature's total defence value",
};

export const AIR_SPEED: ModSchemaColumn = {
    label: 'Air Speed',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'airspeed_val', 1],
    description: "The creature's air speed.",
};

export const LAND_SPEED: ModSchemaColumn = {
    label: 'Land Speed',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'landspeed_val', 1],
    description: "The creature's land speed.",
};

export const WATER_SPEED: ModSchemaColumn = {
    label: 'Water Speed',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'waterspeed_val', 1],
    description: "The creature's water speed.",
};

export const SIGHT_RADIUS: ModSchemaColumn = {
    label: 'Sight Radius',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'sight_radius1', 1],
    description: "The creature's sight radius.",
};

export const FRONT_LEGS: ModSchemaColumn = {
    label: 'Front Legs',
    type: 'string',
    format: true,
    path: ['composition', 0],
    description: "The animal from which the creature's front legs are composed.",
};

export const REAR_LEGS: ModSchemaColumn = {
    label: 'Rear Legs',
    type: 'string',
    format: true,
    path: ['composition', 1],
    description: "The animal from which the creature's rear legs are composed.",
};

export const HEAD: ModSchemaColumn = {
    label: 'Head',
    type: 'string',
    format: true,
    path: ['composition', 2],
    description: "The animal from which the creature's head is composed.",
};

export const TAIL: ModSchemaColumn = {
    label: 'Tail',
    type: 'string',
    format: true,
    path: ['composition', 3],
    description: "The animal from which the creature's tail is composed.",
};

export const TORSO: ModSchemaColumn = {
    label: 'Torso',
    type: 'string',
    format: true,
    path: ['composition', 4],
    description: "The animal from which the creature's torso is composed.",
};

export const PINCERS: ModSchemaColumn = {
    label: 'Pincers',
    type: 'string',
    format: true,
    path: ['composition', 5],
    description: "The animal from which the creature's pincers are composed.",
};

export const WINGS: ModSchemaColumn = {
    label: 'Wings',
    type: 'string',
    format: true,
    path: ['composition', 6],
    description: "The animal from which the creature's wings are composed.",
};

export const ABILITIES: ModSchemaColumn = {
    label: 'Abilities',
    type: 'array',
};

export const POWER: ModSchemaColumn = {
    label: 'Power',
    type: 'float',
    decimal_places: 1,
    path: ['attributes', 'Power', 1],
    description: 'The power rating of the creature.',
};
