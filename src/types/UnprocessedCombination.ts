import UnprocessedCombinationAttributeNames from '~types/UnprocessedCombinationAttributeNames'

interface UnprocessedCombination {
    attributes: {[key in UnprocessedCombinationAttributeNames | string]: number[]}
    stock_1: string
    stock_2: string
    composition: number[]
}

export default UnprocessedCombination
