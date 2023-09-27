<template>
  <div class="row fit justify-center">
    <q-input :error="lowerError !== null"
             :error-message="lowerError?.message"
             :input-style="{textAlign: 'center' }"
             :label="'Minimum ' + label"
             :model-value="lower"
             autogrow
             rounded
             standout
             @update:model-value="v => lower = onLowerChange(v)"/>
    <q-input :error="upperError !== null"
             :error-message="upperError?.message"
             :input-style="{textAlign: 'center' }"
             :label="'Maximum ' + label"
             :model-value="upper"
             autogrow
             rounded
             standout
             @update:model-value="v => upper = onUpperChange(v)"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Joi from 'joi';

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


const lower = ref(props.min)
const upper = ref(props.max)
const lowerError = ref(null)
const upperError = ref(null)


function clamp(input, min, max) {
  return Math.min(Math.max(input, min), max);
}


const validateLower = (input) => {
  let lowerSchema = Joi.number().strict().min(props.min).max(upper.value).messages(
    {
      'number.min': `Must be greater than or equal to ${props.min}`,
      'number.max': `Must be less than or equal to ${upper.value}`
    }).label(`Minimum ${props.label}`)
  let {error} = lowerSchema.validate(input)
  return error ? error : null;
}

const onLowerChange = input => {
  lowerError.value = null
  lowerError.value = validateLower(input)
  let returned = clamp(input, props.min, props.max)
  return isNaN(returned) ? props.min : returned;
}

const validateUpper = (input) => {
  let upperSchema = Joi.number().strict().min(lower.value).max(props.max).messages({
    'number.min': `Must be greater than or equal to ${lower.value}`,
    'number.max': `Must be less than or equal to ${props.max}`
  }).label(`Maximum ${props.label}`)
  let {error} = upperSchema.validate(input)
  return error ? error : null;
}

const onUpperChange = input => {
  upperError.value = null
  upperError.value = validateUpper(input)
  let returned = clamp(input, props.min, props.max)
  return isNaN(returned) ? props.max : returned;
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
