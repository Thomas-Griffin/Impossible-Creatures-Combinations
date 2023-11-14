export default interface CombinationTableFilter {
  label: string
  type: string
  min: number
  max: number
  value: {
    min?: number
    max?: number
    text?: string
    labels?: string[]
  }
  shown: boolean
}
