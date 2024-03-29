import {defineStore} from 'pinia';
import type CombinationTableColumn from '../types/CombinationTableColumn';
import {useModStore} from './modStore';
import type Combination from '../types/Combination';
import type QTablePagination from '../types/QTablePagination';

const modStore = useModStore();

export const useCombinationTableControlsStore = defineStore('CombinationTableControls', {
    state: () => ({
        tableColumns: [] as CombinationTableColumn[],
        tableRows: [] as Combination[],
        gridModeActive: true,
        showGrid: false,
        selectedCombinations: [] as Combination[],
        totalCombinations: 0,
        rowsPerPageOptions: [100, 50, 20, 10, 5, 1],
        pagination: {
            page: 1,
            rowsPerPage: 100,
            rowsNumber: 0
        } as QTablePagination,
        fullscreen: false
    }),
    getters: {
        getTableColumns(state): CombinationTableColumn[] {
            return state.tableColumns;
        },
        getTableRows(state): Combination[] {
            return state.tableRows;
        },
        getTotalCombinations(state): number {
            return state.totalCombinations;
        },
        getGridModeActive(state): boolean {
            return state.gridModeActive;
        },
        getShowGrid(state): boolean {
            return state.showGrid;
        },
        getSelectedCombinations(state): Combination[] {
            return state.selectedCombinations;
        },
        getPagination(state): QTablePagination {
            return state.pagination;
        },
        getRowsPerPageOptions(state): number[] {
            return state.rowsPerPageOptions;
        },
        toggleRowSelected: state => (row: Combination) => {
            const index = state.selectedCombinations.findIndex(c => c._id === row._id);
            if (index === -1) {
                state.selectedCombinations.push(row);
            } else {
                state.selectedCombinations.splice(index, 1);
            }
        },
        getFullscreen(state): boolean {
            return state.fullscreen;
        }
    },
    actions: {
        setTableColumns(CombinationTableColumns: CombinationTableColumn[]) {
            this.$state.tableColumns = CombinationTableColumns;
        },
        setTableRows(CombinationTableRows: Combination[]) {
            this.$state.tableRows = CombinationTableRows;
        },
        setTotalCombinations(totalCombinations: number) {
            this.$state.totalCombinations = totalCombinations;
        },
        setGridModeActive(gridModeActive: boolean) {
            this.$state.gridModeActive = gridModeActive;
        },
        setShowGrid(showGrid: boolean) {
            this.$state.showGrid = showGrid;
        },
        addSelectedCombination(combination: Combination) {
            this.$state.selectedCombinations.push(combination);
        },
        removeSelectedCombination(combination: Combination) {
            const index = this.$state.selectedCombinations.findIndex(c => c._id === combination._id);
            if (index !== -1) {
                this.$state.selectedCombinations.splice(index, 1);
            }
        },
        updateColumn(column: CombinationTableColumn) {
            const index = this.$state.tableColumns.findIndex(c => c.name === column.name);
            if (index !== -1) {
                this.$state.tableColumns[index] = column;
            }
        },
        setPagination(pagination: QTablePagination) {
            this.$state.pagination = pagination;
        },

        setSelectedCombinations(selectedCombinations: Combination[]) {
            this.$state.selectedCombinations = selectedCombinations;
        },
        setFullscreen(fullscreen: boolean) {
            this.$state.fullscreen = fullscreen;
        },

        async getInitialTableColumns() {
            const columns: CombinationTableColumn[] = await this.getColumns();
            this.setTableColumns(columns);
        },
        async getColumns(): Promise<CombinationTableColumn[]> {
            const columns = Array<CombinationTableColumn>();
            const mod = modStore.getMod;
            if (mod?.columns === undefined) {
                return columns;
            }
            for (const column of mod.columns) {
                columns.push({
                    name: column.label,
                    format: (val: string | number | undefined) => (val === -1 || val === undefined ? 'N/A' : `${val}`),
                    label: column.label,
                    field: column.label,
                    type: column.type,
                    sortable: false,
                    min: column.min ? column.min : 0,
                    max: column.max ? column.max : Number.MAX_SAFE_INTEGER,
                    isSorted: {
                        ascending: false,
                        descending: false
                    },
                    align: 'center',
                    shown: true
                } as CombinationTableColumn);
            }
            return columns;
        }
    }
});
