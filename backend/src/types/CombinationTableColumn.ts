import CombinationAttributeName from './CombinationAttributeName';
import {ModColumnType} from './ModColumnType';

export default interface CombinationTableColumn {
    name: CombinationAttributeName;
    label: CombinationAttributeName;
    type: ModColumnType;
    isSorted: {
        ascending: boolean;
        descending: boolean;
    };
    shown: boolean;
    min: number;
    max: number;
    filter?: {
        min?: number;
        max?: number;
        text?: string;
        labels?: string[];
    };
}
