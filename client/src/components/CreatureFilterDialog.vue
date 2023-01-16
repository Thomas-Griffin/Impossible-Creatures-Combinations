<template>
  <q-dialog ref="dialogRef" full-height full-width @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Filter Creatures</div>
        <q-select v-model="selectedFilters"
                  :options="filters"
                  class="cursive-font"
                  dense
                  label="Filters"
                  multiple
                  use-chips
        />

        <div v-for="filter in selectedFilters" :key="filter.label">
          <NumericFilter v-if="filter.type === 'number'"
                         :label="filter.label"
                         :max="filter.max"
                         :min="filter.min"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Filter" @click="onOKClick"/>
        <q-btn color="primary" label="Cancel" @click="onDialogCancel"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script setup>
import NumericFilter from 'components/NumericFilter.vue';
import {ref} from 'vue';

import {useDialogPluginComponent} from 'quasar'


defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()


function onOKClick() {
  onDialogOK({selectedFilters: selectedFilters.value})
}

const props = defineProps({
  fields: {
    type: Array,
    required: true
  }
});

const filters = ref(props.fields);
const selectedFilters = ref([]);


</script>

<style>

</style>



