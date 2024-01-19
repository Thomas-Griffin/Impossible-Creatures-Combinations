import Mod from './Mod';

export interface MongoRequestBody {
    mod: Mod;
    columns?: string[];
}
