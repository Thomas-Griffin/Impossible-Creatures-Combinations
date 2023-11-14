import { QTableColumn } from 'quasar'

export default interface CombinationTableColumn extends QTableColumn {
  type: string
  isSorted: {
    ascending: boolean
    descending: boolean
  }
  shown: boolean
}
