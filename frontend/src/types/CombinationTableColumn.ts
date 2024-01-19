import { QTableColumn } from 'quasar'
import CombinationAttributeName from './CombinationAttributeName'
import ColumnType from './ColumnType'

export default interface CombinationTableColumn extends QTableColumn {
  name: CombinationAttributeName
  label: CombinationAttributeName
  type: ColumnType
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
