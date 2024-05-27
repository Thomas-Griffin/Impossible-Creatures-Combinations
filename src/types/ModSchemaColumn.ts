import CombinationAttributeNames from '~types/CombinationAttributeNames'
import ModColumnType from '~types/ModColumnType'
import CombinationAttributeDescriptions from '~types/CombinationAttributeDescriptions'

type ModSchemaColumn = {
    label: CombinationAttributeNames
    type: ModColumnType
    format?: boolean
    path?: any[]
    description?: CombinationAttributeDescriptions
    decimal_places?: number
}

export default ModSchemaColumn
