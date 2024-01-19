<template>
  <q-select
    v-model="selectedAbilities"
    :options="abilities"
    dense
    flat
    label="Ability Filter"
    multiple
    options-selected-class="text-blue"
    rounded
    @update:model-value="setAbilitiesFilter"
  />
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import Ability from '../../types/Ability';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();
onMounted(() => {});

const props = defineProps({
  column: {
    type: Object as () => CombinationTableColumn,
    required: true
  }
});
const abilities = ref<Ability[]>([]);
const selectedAbilities = ref<Ability[]>([]);

const setAbilitiesFilter = () => {
  tableControls.setTableColumns(
    tableControls.getTableColumns.map((column: CombinationTableColumn) => {
      if (column.name === props.column.name) {
        return {
          ...column,
          filter: {labels: selectedAbilities.value?.map((ability: Ability) => ability.ability) || []}
        } as CombinationTableColumn;
      }
      return column;
    })
  );
};
</script>
