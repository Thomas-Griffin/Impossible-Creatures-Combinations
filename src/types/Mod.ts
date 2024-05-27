import ModNames from '~types/ModNames'
import ModVersions from '~types/ModVersions'
import ModColumn from '~types/ModColumn'

interface Mod {
    name: ModNames
    version: ModVersions
    columns?: ModColumn[]
}

export default Mod
