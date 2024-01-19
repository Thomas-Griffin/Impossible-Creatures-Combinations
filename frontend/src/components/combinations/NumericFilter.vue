<template>
  <div class="row fit justify-center">
    <q-input
      v-model.number="lower"
      :error="lowerError !== ''"
      :error-message="lowerError"
      :input-style="{textAlign: 'center'}"
      :label="'Minimum ' + column.label"
      autogrow
      rounded
      standout
      type="number"
      @update:model-value="value => onLowerChange(value)"
    />
    <q-input
      v-model.number="upper"
      :error="upperError !== ''"
      :error-message="upperError"
      :input-style="{textAlign: 'center'}"
      :label="'Maximum ' + column.label"
      autogrow
      rounded
      standout
      type="number"
      @update:model-value="value => onUpperChange(value)"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import Joi from 'joi';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();

const props = defineProps({
  column: {
    type: Object as () => CombinationTableColumn,
    required: true
  }
});

const lower = ref<number>(props.column.min);
const upper = ref<number>(props.column.max);
const lowerError = ref<string>('');
const upperError = ref<string>('');
const columnRef = ref<CombinationTableColumn>();

onMounted(() => {
  columnRef.value = tableControls.getTableColumns.find(column => column.name === props.column.name);
  if (!columnRef.value) {
    return;
  }
  if (columnRef.value.filter?.min) {
    lower.value = columnRef.value.filter.min;
  }
  if (columnRef.value.filter?.max) {
    upper.value = columnRef.value.filter.max;
  }
});

const clamp = (input: number, min: number, max: number) => Math.min(Math.max(input, min), max);

const validateLower = (input: number) => {
  let lowerSchema = Joi.number()
    .strict()
    .min(props.column.min)
    .max(Number(upper.value))
    .messages({
      'number.min': `Must be greater than or equal to ${props.column.min}`,
      'number.max': `Must be less than or equal to ${upper.value}`
    })
    .label(`Minimum ${props.column.label}`);
  let {error} = lowerSchema.validate(input);
  return error ? error.message : '';
};

const onLowerChange = (input: string | number | null) => {
  input = Number(input);
  lowerError.value = validateLower(input);
  let clampedValue = clamp(input, props.column.min, props.column.max);
  lower.value = isNaN(clampedValue) ? props.column.min : clampedValue;
  updateColumnFilter();
};

const validateUpper = (input: number) => {
  let upperSchema = Joi.number()
    .strict()
    .min(Number(lower.value))
    .max(props.column.max)
    .messages({
      'number.min': `Must be greater than or equal to ${lower.value}`,
      'number.max': `Must be less than or equal to ${props.column.max}`
    })
    .label(`Maximum ${props.column.label}`);
  let {error} = upperSchema.validate(input);
  return error ? error.message : '';
};

const onUpperChange = (input: string | number | null) => {
  input = Number(input);
  upperError.value = validateUpper(input);
  let clampedValue = clamp(input, props.column.min, props.column.max);
  upper.value = isNaN(clampedValue) ? props.column.max : clampedValue;
  updateColumnFilter();
};

const updateColumnFilter = () => {
  if (!columnRef.value) {
    return;
  }
  columnRef.value.filter = {min: lower.value, max: upper.value};
  tableControls.updateColumn(columnRef.value);
};
</script>
