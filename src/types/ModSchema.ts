import ModSchemaColumn from './ModSchemaColumn'

interface ModSchema {
    name: string
    version: string
    columns: ModSchemaColumn[]
}

export default ModSchema
