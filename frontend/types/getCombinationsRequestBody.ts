import type Mod from './Mod'
import type {CombinationAttributeName} from './CombinationAttributeName'
import type CombinationTableColumn from './CombinationTableColumn'

export default interface GetCombinationsRequestBody {
    mod: Mod
    sorting: {
        column: CombinationAttributeName
        order: 'ascending' | 'descending'
    }
    filters: CombinationTableColumn[]
    perPage: number
    page: number
}
