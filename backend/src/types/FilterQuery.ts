import CombinationAttributeName from './CombinationAttributeName';

export type FilterQuery = {
    [key in CombinationAttributeName | 'Abilities.ability' | 'Mod.name' | 'Mod.version']:
        | string
        | number
        | {$gte: number; $lte: number}
        | {$regex: RegExp}
        | {$all: string[]};
};
