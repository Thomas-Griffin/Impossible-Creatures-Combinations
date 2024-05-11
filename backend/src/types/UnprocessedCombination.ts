import UnprocessedCombinationAttributeName from './UnprocessedCombinationAttributeName';

export default interface UnprocessedCombination {
    attributes: {[key in UnprocessedCombinationAttributeName | string]: number[]};
    stock_1: string;
    stock_2: string;
    composition: number[];
}
