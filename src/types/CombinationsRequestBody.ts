import CombinationAttributeNames from './CombinationAttributeNames'
import {DataTableFilterMeta} from 'primevue/datatable'
import SortingType from './SortingType'
import Mod from './Mod'

interface CombinationsRequestBody {
    mod: Mod
    sorting?: {
        column: CombinationAttributeNames
        order: SortingType
    }
    filters?: DataTableFilterMeta
    perPage: number
    page: number
}

export default CombinationsRequestBody
