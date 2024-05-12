import CombinationAttributeName from './CombinationAttributeName';
import {ModColumnType} from './ModColumnType';

export interface ModColumn {
    label: CombinationAttributeName;
    type: ModColumnType;
    min?: number;
    max?: number;
}
