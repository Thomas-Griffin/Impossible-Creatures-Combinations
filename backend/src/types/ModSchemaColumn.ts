import CombinationAttributeName from './CombinationAttributeName';
import {ModColumnType} from './ModColumnType';

export type ModSchemaColumn = {
    label: CombinationAttributeName;
    type: ModColumnType;
    format?: boolean;
    path?: any[];
    description?: string;
    decimal_places?: number;
};
