import Mod from './Mod';
import CombinationTableColumn from './CombinationTableColumn';

interface GetCombinationsRequestBody {
    mod: Mod;
    sorting?: {
        column: string;
        order: string;
    };
    filters?: CombinationTableColumn[];
    perPage: number;
    page: number;
}

export default GetCombinationsRequestBody;
