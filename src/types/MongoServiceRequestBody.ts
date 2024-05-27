import Mod from '~types/Mod'

interface MongoServiceRequestBody {
    mod: Mod
    columns?: string[]
}

export default MongoServiceRequestBody
