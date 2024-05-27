import CombinationAttributeNames from '~types/CombinationAttributeNames'
import ModColumnType from '~types/ModColumnType'

interface CombinationTableColumn {
    name: CombinationAttributeNames
    label: CombinationAttributeNames
    type: ModColumnType
    isSorted: {
        ascending: boolean
        descending: boolean
    }
    shown: boolean
    min: number
    max: number
    filter?: {
        min?: number
        max?: number
        text?: string
        labels?: string[]
    }
}

export default CombinationTableColumn
