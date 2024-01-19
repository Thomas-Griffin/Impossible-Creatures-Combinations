<template>
  <CombinedCreatureCombinationTable v-if="initialModIsSet" />
</template>

<script lang="ts" setup>
import CombinedCreatureCombinationTable from 'components/combinations/CombinedCreatureCombinationTable.vue';
import {computed} from 'vue';
import {useModStore} from '../stores/modStore';

const modStore = useModStore();

const initialModIsSet = computed(() => modStore.getMod.name !== '' && modStore.getMod.version !== '');
</script>
