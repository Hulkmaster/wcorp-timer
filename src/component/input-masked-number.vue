<template>
  <PrmInputText
    v-bind="inputProps"
    :model-value="modelValue"
    :placeholder="props.inputProps?.placeholder || mask"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    :pt="{
      'root': {
        onInput,
      },
    }"
  />
</template>

<script setup lang="ts">
import PrmInputText, { type InputTextProps } from 'primevue/inputtext';

const props = defineProps<{
  /**
   * format can have any symbol and any number
   * any number will be formatted as "highest possible value is number"
   * a minus as the first symbol allows numbers be negative
   *
   * example: 99:63 - first two numbers can be 0-9, third 0-6, last 0-3, can't be negative
   */
  mask: string,
  modelValue: string,
  inputProps?: InputTextProps,
  disabled?: boolean,
  readonly?: boolean,
  loading?: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void,
}>();

function onUpdate(value: string) {
  let result = (value.charAt(0) === '-' && props.mask.charAt(0) === '-') ? '-' : '';

  for (let i = 0; i < props.mask.length; i++) {
    const token = value.charAt(i + (value.charAt(0) === '-' ? 1 : 0));
    const validationToken = props.mask.charAt(i + (props.mask.charAt(0) === '-' ? 1 : 0));
    const parsedToken = parseInt(token, 10) || token;
    const validationParsedToken = parseInt(validationToken, 10) || validationToken;

    if (typeof validationParsedToken !== 'number') {
      result += validationParsedToken;

      continue;
    }

    if (typeof parsedToken !== 'number') {
      result += 0;

      continue;
    }

    if (parsedToken > validationParsedToken) {
      result += validationParsedToken;

      continue;
    }

    result += parsedToken;
  }

  emit('update:modelValue', result);
  return result;
}

function onInput(event: InputEvent) {
  const cursorPosition = (event.target as HTMLInputElement).selectionStart;

  const newValue = onUpdate((event.target as HTMLInputElement).value);

  (event.target as HTMLInputElement).value = newValue;
  (event.target as HTMLInputElement).setSelectionRange(cursorPosition, cursorPosition);
}

onUpdate(props.modelValue);
</script>
