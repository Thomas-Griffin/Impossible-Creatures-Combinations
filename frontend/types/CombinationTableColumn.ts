import type { CombinationAttributeName } from "./CombinationAttributeName";
import type { ColumnType } from "./ColumnType";

export default interface CombinationTableColumn {
  name: CombinationAttributeName;
  label: CombinationAttributeName;
  type: ColumnType;
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
