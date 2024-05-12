import {ModSchemaColumn} from './ModSchemaColumn';

export interface ModSchema {
    name: string;
    version: string;
    columns: ModSchemaColumn[];
}
