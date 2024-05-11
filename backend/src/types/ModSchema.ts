import CombinationAttributeName from './CombinationAttributeName';
import ColumnType from './ColumnType';

export interface ModSchema {
    name: string;
    version: string;
    columns: {
        label: CombinationAttributeName;
        type: ColumnType;
        format?: boolean;
        path?: any[];
        description?: string;
        decimal_places?: number;
    }[];
}
