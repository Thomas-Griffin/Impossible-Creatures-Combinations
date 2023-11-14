<template>
  <div class="row fit justify-center">
    <q-input
      v-model.number="lower"
      :error="lowerError !== ''"
      :error-message="lowerError"
      :input-style="{ textAlign: 'center' }"
      :label="'Minimum ' + label"
      autogrow
      rounded
      standout
      @update:model-value="value => (lower = onLowerChange(value))"
    />
    <q-input
      v-model.number="upper"
      :error="upperError !== ''"
      :error-message="upperError"
      :input-style="{ textAlign: 'center' }"
      :label="'Maximum ' + label"
      autogrow
      rounded
      standout
      @update:model-value="value => (upper = onUpperChange(value))"
    />
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import Joi from 'joi'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
})

const lower = ref<number | undefined>(props.min)
const upper = ref<number | undefined>(props.max)
const lowerError = ref<string>('')
const upperError = ref<string>('')

const clamp = (input: number, min: number, max: number) => Math.min(Math.max(input, min), max)

const validateLower = (input: number) => {
  let lowerSchema = Joi.number()
    .strict()
    .min(props.min)
    .max(Number(upper.value))
    .messages({
      'number.min': `Must be greater than or equal to ${props.min}`,
      'number.max': `Must be less than or equal to ${upper.value}`,
    })
    .label(`Minimum ${props.label}`)
  let { error } = lowerSchema.validate(input)
  return error ? error.message : ''
}

const onLowerChange = (input: string | number | null) => {
  input = Number(input)
  lowerError.value = validateLower(input)
  let returned = clamp(input, props.min, props.max)
  return isNaN(returned) ? props.min : returned
}

const validateUpper = (input: number) => {
  let upperSchema = Joi.number()
    .strict()
    .min(Number(lower.value))
    .max(props.max)
    .messages({
      'number.min': `Must be greater than or equal to ${lower.value}`,
      'number.max': `Must be less than or equal to ${props.max}`,
    })
    .label(`Maximum ${props.label}`)
  let { error } = upperSchema.validate(input)
  return error ? error.message : ''
}

const onUpperChange = (input: string | number | null) => {
  input = Number(input)
  upperError.value = validateUpper(input)
  let returned = clamp(input, props.min, props.max)
  return isNaN(returned) ? props.max : returned
}

const getValues = () => ({
  min: lower.value ? lower.value : null,
  max: upper.value ? upper.value : null,
})

defineExpose({
  getValues,
})
</script>

<style></style>
