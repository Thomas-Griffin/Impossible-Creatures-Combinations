import type { CombinationAttributeName } from "./CombinationAttributeName";
import type { DataTableFilterMeta } from "primevue/datatable";

export default interface GetCombinationsRequestBody {
  mod: { name: string; version: string };
  sorting: {
    column: CombinationAttributeName;
    order: "ascending" | "descending";
  };
  filters: DataTableFilterMeta;
  perPage: number;
  page: number;
}
