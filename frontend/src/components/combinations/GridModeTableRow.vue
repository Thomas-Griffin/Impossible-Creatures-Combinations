<template>
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
    <q-card>
      <q-card-section class="cursive-font text-h4 q-pb-none">
        <q-item class="justify-center">Combination {{ props.content.rowIndex + 1 }}</q-item>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-list dense>
          <q-item
            v-for="tableColumn in nonArrayColumns as CombinationTableColumn[]"
            :key="tableColumn.name"
            dense
          >
            <q-item
              v-if="columnIsShown(tableColumn.name)"
              class="cursive-font text-h6"
              dense
              side
              >{{ tableColumn.name }}
            </q-item>
            <q-item
              v-if="columnIsShown(tableColumn.name)"
              class="standard-font text-h6 absolute-right"
              dense
              side
              >{{ props.content.row[tableColumn.name] === -1 ? ' (N/A)' : props.content.row[tableColumn.name] }}
            </q-item>
          </q-item>
          <q-item-section
            class="items-center"
            style="min-height: 200px; top: 0"
          >
            <q-item
              v-if="columnIsShown('Abilities')"
              class="cursive-font text-h5"
              dense
              >Abilities
            </q-item>
            <q-item
              v-for="ability in props.content.row.Abilities as Ability[]"
              :key="ability.ability"
              class="standard-font text-left justify-center text-h6"
              dense
            >
              {{ ability.ability }}:
              <q-item
                class="standard-font text-right justify-center text-h6"
                dense
                side
                >{{ ability.source }}
              </q-item>
            </q-item>
            <q-item
              v-if="props.content.row.Abilities.length === 0"
              class="standard-font text-h6"
              dense
              side
            >
              No abilities
            </q-item>
          </q-item-section>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType} from 'vue';
import QTableGridModeItemProps from '../../types/QTableGridModeItemProps';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import CombinationAttributeName from '../../types/CombinationAttributeName';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import Ability from '../../types/Ability';

const tableControls = useCombinationTableControlsStore();

const props = defineProps({
  content: {
    type: Object as PropType<QTableGridModeItemProps>,
    required: true
  }
});

const nonArrayColumns = computed(() => tableControls.getTableColumns?.filter((column: CombinationTableColumn) => column.type !== 'array'));

const shownTableColumns = computed(() => tableControls.getTableColumns?.filter((column: CombinationTableColumn) => column.shown));
const columnIsShown = (columnName: CombinationAttributeName) => {
  return shownTableColumns.value.some((column: CombinationTableColumn) => column.name === columnName);
};
</script>

<style lang="sass" scoped>
q-item
  padding: 0 !important
</style>
