import CombinationAttributeNames from '~types/CombinationAttributeNames'
import {DataTableFilterMeta} from 'primevue/datatable'
import SortingType from '~types/SortingType'
import Mod from '~types/Mod'

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
