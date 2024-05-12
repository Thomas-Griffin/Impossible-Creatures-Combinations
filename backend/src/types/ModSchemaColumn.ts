import CombinationAttributeName from './CombinationAttributeName';
import ColumnType from './ColumnType';

export type ModSchemaColumn = {
    label: CombinationAttributeName;
    type: ColumnType;
    format?: boolean;
    path?: any[];
    description?: string;
    decimal_places?: number;
};
