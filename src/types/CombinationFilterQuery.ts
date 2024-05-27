import CombinationAttributeNames from '~types/CombinationAttributeNames'

type CombinationFilterQuery = {
    [key in CombinationAttributeNames | 'Abilities.ability' | 'Mod.name' | 'Mod.version' | '$and' | '$or' | '$not']:
        | string
        | number
        | {
              $not: string | {$regex: RegExp}
          }
        | {$in: string}
        | {$lt: string}
        | {$gt: string}
        | {$lte: string}
        | {$gte: string}
        | {$gte: number; $lte: number}
        | {$regex: RegExp}
        | {$all: string[]}
        | CombinationFilterQuery
        | CombinationFilterQuery[]
}
export default CombinationFilterQuery
