<template>
  <suspense v-if="initialModIsSet">
    <CombinedCreatureCombinationTable />
  </suspense>
</template>

<script lang="ts" setup>
import CombinedCreatureCombinationTable from 'components/combinations/CombinedCreatureCombinationTable.vue'
import { computed } from 'vue'
import { useModStore } from 'src/stores/modStore'

const modStore = useModStore()

const initialModIsSet = computed(() => modStore.getMod.name !== '' && modStore.getMod.version !== '')
</script>
