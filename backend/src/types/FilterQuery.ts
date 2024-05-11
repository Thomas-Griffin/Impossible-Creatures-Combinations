import CombinationAttributeName from './CombinationAttributeName';

export type FilterQuery = {
    [key in CombinationAttributeName | 'Abilities.ability']:
        | string
        | number
        | {$gte: number; $lte: number}
        | {$regex: RegExp}
        | {$all: string[]};
};
