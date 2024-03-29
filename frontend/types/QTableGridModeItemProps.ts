import type {CombinationAttributeName} from './CombinationAttributeName';

export default interface QTableGridModeItemProps {
    key: string;
    row: [key: CombinationAttributeName, value: string];
    rowIndex: number;
    pageIndex: number;
    cols: [];
    colsMap: { [key: string]: never };
    sort: (col: never) => void;
    selected: boolean;
    expand: boolean;
    color: string;
    dark: boolean | null;
    dense: boolean;
}
