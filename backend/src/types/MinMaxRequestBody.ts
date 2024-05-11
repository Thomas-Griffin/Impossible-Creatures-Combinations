import Mod from './Mod';
import CombinationAttributeName from './CombinationAttributeName';

export interface MinMaxRequestBody {
    mod: Mod;
    attribute: CombinationAttributeName;
}
