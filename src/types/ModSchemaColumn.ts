import CombinationAttributeNames from './CombinationAttributeNames'
import ModColumnType from './ModColumnType'
import CombinationAttributeDescriptions from './CombinationAttributeDescriptions'

type ModSchemaColumn = {
    label: CombinationAttributeNames
    type: ModColumnType
    format?: boolean
    path?: any[]
    description?: CombinationAttributeDescriptions
    decimal_places?: number
}

export default ModSchemaColumn
