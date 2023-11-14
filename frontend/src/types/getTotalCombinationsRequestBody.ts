import { Mod } from './Mod'
import FilterDataStructure from './FilterDataStructure'

export interface GetTotalCombinationsRequestBody {
  mod: Mod
  sorting: {
    column: string
    order: string
  }
  filters: FilterDataStructure
}
