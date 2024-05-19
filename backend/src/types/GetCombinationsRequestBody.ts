import Mod from './Mod';
import CombinationAttributeName from './CombinationAttributeName';
import SortingType from './SortingType';
import {DataTableFilterMeta} from 'primevue/datatable';

interface GetCombinationsRequestBody {
    mod: Mod;
    sorting?: {
        column: CombinationAttributeName;
        order: SortingType;
    };
    filters?: DataTableFilterMeta;
    perPage: number;
    page: number;
}

export default GetCombinationsRequestBody;
