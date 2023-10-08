<template>
  <suspense v-if="initialModIsSet">
    <CombinedCreatureCombinationTable />
  </suspense>
</template>

<script setup>
import CombinedCreatureCombinationTable from 'components/combinations/CombinedCreatureCombinationTable.vue';
import { computed } from 'vue';
import { useModStore } from 'stores/modStore';

const modStore = useModStore();

const initialModIsSet = computed(() => {
  return modStore.getMod.name !== '' && modStore.getMod.version !== '';
});
</script>
