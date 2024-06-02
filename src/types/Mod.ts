import ModNames from './ModNames'
import ModVersions from './ModVersions'
import ModColumn from './ModColumn'

interface Mod {
    name: ModNames
    version: ModVersions
    columns?: ModColumn[]
}

export default Mod
