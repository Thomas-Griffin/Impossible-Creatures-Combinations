import CombinationAttributeName from './CombinationAttributeName';
import ColumnType from './ColumnType';

export interface ModColumn {
    label: CombinationAttributeName;
    type: ColumnType;
    min?: number;
    max?: number;
}
