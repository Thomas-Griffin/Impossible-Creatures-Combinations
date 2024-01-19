import Mod from './Mod'
import CombinationAttributeName from './CombinationAttributeName'
import CombinationTableColumn from './CombinationTableColumn'

export interface GetCombinationsRequestBody {
  mod: Mod
  sorting: {
    column: CombinationAttributeName
    order: 'ascending' | 'descending'
  }
  filters: CombinationTableColumn[]
  perPage: number
  page: number
}
