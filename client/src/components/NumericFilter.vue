<template>

  <div class="row fit justify-center">
    <q-input :input-style="{textAlign: 'center' }"
             :label="'Minimum ' + label"
             :model-value="lower"
             :rules="[value => (value >= min && value <= max) || `Value must be between ${min} and ${max}`,
             value => value <= upper || `Value must be less than or equal to maximum value`]"
             rounded
             standout
             type="number"
             @update:model-value="v => lower = onLowerChange(v)"/>
    <q-input :input-style="{textAlign: 'center' }"
             :label="'Maximum ' + label"
             :model-value="upper"
             :rules="[value => (value >= min && value <= max) || `Value must be between ${min} and ${max}`,
             value => value >= lower || `Value must be greater than or equal to minimum value`]"
             rounded
             standout
             type="number"
             @update:model-value="v => upper = onUpperChange(v)"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  }
});


const lower = ref(0)
const upper = ref(0)

function clamp(input, min, max) {
  return Math.min(Math.max(input, min), max);
}

const onLowerChange = input => {
  if (input.toString().match(/[^0-9]/g)) {
    input = input.replace(/[^0-9]/g, '')
  }
  if (input === '' || isNaN(input)) {
    return 0
  } else {
    let returned = clamp(input, props.min, props.max)
    return isNaN(returned) ? 0 : returned;
  }
};

const onUpperChange = input => {
  if (input.toString().match(/[^0-9]/g)) {
    input = input.replace(/[^0-9]/g, '')
  }
  if (input === '' || isNaN(input)) {
    return 0
  } else {
    let returned = clamp(input, props.min, props.max)
    return isNaN(returned) ? 0 : returned;
  }
};


const getValues = () => {
  return {
    min: lower.value ? lower.value : null,
    max: upper.value ? upper.value : null
  }
}

defineExpose({
  getValues
})

</script>

<style>
</style>
