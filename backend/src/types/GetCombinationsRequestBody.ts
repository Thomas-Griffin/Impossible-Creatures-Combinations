import Mod from './Mod';
import CombinationTableColumn from './CombinationTableColumn';
import CombinationAttributeName from './CombinationAttributeName';
import SortingType from './SortingType';

interface GetCombinationsRequestBody {
    mod: Mod;
    sorting?: {
        column: CombinationAttributeName;
        order: SortingType;
    };
    filters?: CombinationTableColumn[];
    perPage: number;
    page: number;
}

export default GetCombinationsRequestBody;
