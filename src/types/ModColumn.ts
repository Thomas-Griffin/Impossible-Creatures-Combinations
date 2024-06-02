import CombinationAttributeNames from './CombinationAttributeNames'
import ModColumnType from './ModColumnType'

interface ModColumn {
    label: CombinationAttributeNames
    type: ModColumnType
    min?: number
    max?: number
}

export default ModColumn
