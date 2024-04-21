import type { CombinationAttributeName } from "./CombinationAttributeName";
import type { ColumnType } from "./ColumnType";

export interface ModColumn {
  label: CombinationAttributeName;
  type: ColumnType;
  min?: number;
  max?: number;
}
