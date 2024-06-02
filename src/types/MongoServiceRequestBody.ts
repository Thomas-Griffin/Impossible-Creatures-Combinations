import Mod from './Mod'

interface MongoServiceRequestBody {
    mod: Mod
    columns?: string[]
}

export default MongoServiceRequestBody
