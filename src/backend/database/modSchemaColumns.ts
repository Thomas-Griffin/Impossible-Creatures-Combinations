import CombinationAttributeNames from '~types/CombinationAttributeNames'
import ModColumnType from '~types/ModColumnType'
import ModSchemaColumn from '~types/ModSchemaColumn'
import CombinationAttributeDescriptions from '~types/CombinationAttributeDescriptions'

export const ANIMAL1: ModSchemaColumn = {
    label: CombinationAttributeNames.ANIMAL_1,
    type: ModColumnType.STRING,
    format: true,
    path: ['stock_1'],
    description: CombinationAttributeDescriptions.ANIMAL_1,
}

export const ANIMAL2: ModSchemaColumn = {
    label: CombinationAttributeNames.ANIMAL_2,
    type: ModColumnType.STRING,
    format: true,
    path: ['stock_2'],
    description: CombinationAttributeDescriptions.ANIMAL_2,
}

export const RESEARCH_LEVEL: ModSchemaColumn = {
    label: CombinationAttributeNames.RESEARCH_LEVEL,
    type: ModColumnType.INTEGER,
    path: ['attributes', 'creature_rank', 1],
    description: CombinationAttributeDescriptions.RESEARCH_LEVEL,
}

export const COAL: ModSchemaColumn = {
    label: CombinationAttributeNames.COAL,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'cost', 1],
    description: CombinationAttributeDescriptions.COAL,
}

export const ELECTRICITY: ModSchemaColumn = {
    label: CombinationAttributeNames.ELECTRICITY,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'costrenew', 1],
    description: CombinationAttributeDescriptions.ELECTRICITY,
}

export const ELECTRICITY_TELLURIAN: ModSchemaColumn = {
    label: CombinationAttributeNames.ELECTRICITY,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'costRenew', 1],
    description: CombinationAttributeDescriptions.ELECTRICITY,
}

export const HEALTH: ModSchemaColumn = {
    label: CombinationAttributeNames.HEALTH,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'health_val', 1],
    description: CombinationAttributeDescriptions.HEALTH,
}

export const EHP: ModSchemaColumn = {
    label: CombinationAttributeNames.EHP,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'ehp', 1],
    description: CombinationAttributeDescriptions.EHP,
}

export const GENERATED_EHP: ModSchemaColumn = {
    label: CombinationAttributeNames.EHP,
    type: ModColumnType.GENERATED,
    description: CombinationAttributeDescriptions.EHP,
}

export const SDT: ModSchemaColumn = {
    label: CombinationAttributeNames.SDT,
    type: ModColumnType.GENERATED,
    description: CombinationAttributeDescriptions.EHP,
}

export const SIZE: ModSchemaColumn = {
    label: CombinationAttributeNames.SIZE,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'size', 1],
    description: CombinationAttributeDescriptions.SIZE,
}

export const POPULATION_SIZE: ModSchemaColumn = {
    label: CombinationAttributeNames.POPULATION_SIZE,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'popsize', 1],
    description: CombinationAttributeDescriptions.POPULATION_SIZE,
}

export const MELEE_DAMAGE: ModSchemaColumn = {
    label: CombinationAttributeNames.MELEE_DAMAGE,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'damage_val', 1],
    description: CombinationAttributeDescriptions.MELEE_DAMAGE,
}

export const DEFENCE: ModSchemaColumn = {
    label: CombinationAttributeNames.DEFENCE,
    type: ModColumnType.PERCENTAGE,
    decimal_places: 1,
    path: ['attributes', 'armour', 1],
    description: CombinationAttributeDescriptions.DEFENCE,
}

export const AIR_SPEED: ModSchemaColumn = {
    label: CombinationAttributeNames.AIR_SPEED,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'airspeed_val', 1],
    description: CombinationAttributeDescriptions.AIR_SPEED,
}

export const LAND_SPEED: ModSchemaColumn = {
    label: CombinationAttributeNames.LAND_SPEED,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'landspeed_val', 1],
    description: CombinationAttributeDescriptions.LAND_SPEED,
}

export const WATER_SPEED: ModSchemaColumn = {
    label: CombinationAttributeNames.WATER_SPEED,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'waterspeed_val', 1],
    description: CombinationAttributeDescriptions.WATER_SPEED,
}

export const SIGHT_RADIUS: ModSchemaColumn = {
    label: CombinationAttributeNames.SIGHT_RADIUS,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'sight_radius1', 1],
    description: CombinationAttributeDescriptions.SIGHT_RADIUS,
}

export const FRONT_LEGS: ModSchemaColumn = {
    label: CombinationAttributeNames.FRONT_LEGS,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 0],
    description: CombinationAttributeDescriptions.FRONT_LEGS,
}

export const REAR_LEGS: ModSchemaColumn = {
    label: CombinationAttributeNames.REAR_LEGS,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 1],
    description: CombinationAttributeDescriptions.REAR_LEGS,
}

export const HEAD: ModSchemaColumn = {
    label: CombinationAttributeNames.HEAD,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 2],
    description: CombinationAttributeDescriptions.HEAD,
}

export const TAIL: ModSchemaColumn = {
    label: CombinationAttributeNames.TAIL,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 3],
    description: CombinationAttributeDescriptions.TAIL,
}

export const TORSO: ModSchemaColumn = {
    label: CombinationAttributeNames.TORSO,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 4],
    description: CombinationAttributeDescriptions.TORSO,
}

export const PINCERS: ModSchemaColumn = {
    label: CombinationAttributeNames.PINCERS,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 5],
    description: CombinationAttributeDescriptions.PINCERS,
}

export const WINGS: ModSchemaColumn = {
    label: CombinationAttributeNames.WINGS,
    type: ModColumnType.STRING,
    format: true,
    path: ['composition', 6],
    description: CombinationAttributeDescriptions.WINGS,
}

export const ABILITIES: ModSchemaColumn = {
    label: CombinationAttributeNames.ABILITIES,
    type: ModColumnType.ARRAY,
    description: CombinationAttributeDescriptions.ABILITIES,
}

export const ABILITY_SOURCES: ModSchemaColumn = {
    label: CombinationAttributeNames.ABILITY_SOURCES,
    type: ModColumnType.ARRAY,
    description: CombinationAttributeDescriptions.ABILITY_SOURCES,
}

export const POWER: ModSchemaColumn = {
    label: CombinationAttributeNames.POWER,
    type: ModColumnType.FLOAT,
    decimal_places: 1,
    path: ['attributes', 'Power', 1],
    description: CombinationAttributeDescriptions.POWER,
}
