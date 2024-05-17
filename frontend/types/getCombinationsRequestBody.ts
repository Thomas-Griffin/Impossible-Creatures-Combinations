import type { CombinationAttributeName } from "./CombinationAttributeName";
import type CombinationTableColumn from "./CombinationTableColumn";

export default interface GetCombinationsRequestBody {
  mod: { name: string; version: string };
  sorting: {
    column: CombinationAttributeName;
    order: "ascending" | "descending";
  };
  filters: CombinationTableColumn[];
  perPage: number;
  page: number;
}
