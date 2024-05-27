import CombinationAttributeNames from '~types/CombinationAttributeNames'
import ModColumnType from '~types/ModColumnType'

interface ModColumn {
    label: CombinationAttributeNames
    type: ModColumnType
    min?: number
    max?: number
}

export default ModColumn
