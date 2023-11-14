export interface ModSchema {
  name: string
  version: string
  columns: {
    label: string
    type: string
    format?: boolean
    path?: any[]
    description?: string
    decimal_places?: number
  }[]
}
