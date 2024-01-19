<template>
  <td
    class="flex justify-between"
    style="min-width: 500px"
  >
    <div
      v-for="ability in props.abilities"
      :key="ability.ability"
      class="inline-block"
      >{{ ability.ability }}:
      {{ ability.source }}
    </div>
  </td>
</template>
<script lang="ts" setup>
import {PropType} from 'vue';
import Ability from '../../types/Ability';

const props = defineProps({
  abilities: {
    type: Array as PropType<Ability[]>,
    required: true
  }
});
</script>
