import ModColumn from '../../types/ModColumn'
import CombinationAttributeNames from '../../types/CombinationAttributeNames'
import ModColumnType from '../../types/ModColumnType'
import ModNames from '../../types/ModNames'
import Mod from '../../types/Mod'

const modColumns: ModColumn[] = [
    {
        label: CombinationAttributeNames.ANIMAL_1,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.ANIMAL_2,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.ABILITIES,
        type: ModColumnType.ARRAY,
    },
    {
        label: CombinationAttributeNames.ABILITY_SOURCES,
        type: ModColumnType.ARRAY,
    },
    {
        label: CombinationAttributeNames.AIR_SPEED,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.COAL,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.DEFENCE,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.EHP,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.ELECTRICITY,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.FRONT_LEGS,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.HEAD,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.HEALTH,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.LAND_SPEED,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.MELEE_DAMAGE,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.PINCERS,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.POPULATION_SIZE,
        type: ModColumnType.INTEGER,
    },
    {
        label: CombinationAttributeNames.POWER,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.REAR_LEGS,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.RESEARCH_LEVEL,
        type: ModColumnType.INTEGER,
    },
    {
        label: CombinationAttributeNames.SDT,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.SIGHT_RADIUS,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.SIZE,
        type: ModColumnType.INTEGER,
    },
    {
        label: CombinationAttributeNames.TAIL,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.TORSO,
        type: ModColumnType.STRING,
    },
    {
        label: CombinationAttributeNames.WATER_SPEED,
        type: ModColumnType.FLOAT,
    },
    {
        label: CombinationAttributeNames.WINGS,
        type: ModColumnType.STRING,
    },
]

const mods: Mod[] = [
    {
        name: ModNames.VANILLA,
        version: '1.1',
        columns: modColumns,
    },
    {
        name: ModNames.INSECT_INVASION,
        version: '1.4',
        columns: modColumns,
    },
    {
        name: ModNames.SMOD,
        version: '9.25',
        columns: modColumns,
    },
    {
        name: ModNames.TELLURIAN,
        version: '1.4',
        columns: modColumns,
    },
    {
        name: ModNames.TELLURIAN,
        version: '2.0',
        columns: modColumns,
    },
    {
        name: ModNames.TELLURIAN,
        version: '2.9.1.4',
        columns: modColumns,
    },
    {
        name: ModNames.TELLURIAN,
        version: '2.10',
        columns: modColumns,
    },
    {
        name: ModNames.TELLURIAN,
        version: '2.10.0.3',
        columns: modColumns,
    },
]

export default mods
