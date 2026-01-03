<template>
  <InputMaskedNumber
    :model-value="formatDurationString(modelValue)"
    style="min-width: 100px; padding-right: 1.5rem; width: 100%"
    :class="{
      'p-invalid': invalid,
    }"
    :mask="mask"
    placeholder="000:00:00"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    :input-props="inputProps"
    @update:model-value="emit('update:modelValue', parseDurationString($event))"
  />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import {
  computed,
  watch,
} from 'vue';
import InputMaskedNumber from './input-masked-number.vue';
import { InputTextProps } from 'primevue/inputtext';

type TDurationInSeconds = number;

const props = defineProps<{
  modelValue: TDurationInSeconds,
  canBeNegative?: boolean,
  disabled?: boolean,
  invalid?: boolean,
  errorMessage?: string,
  readonly?: boolean,
  loading?: boolean,
  inputProps?: InputTextProps,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TDurationInSeconds): void,
}>();

const mask = computed(() => `${props.canBeNegative ? '-' : ''}999:59:59`);

function formatDurationString(durationSeconds: TDurationInSeconds): string {
  const duration = dayjs.duration(Math.abs(durationSeconds), 'seconds');
  // this is the most reliable way to check for negative numbers, as this includes
  // check for negative 0.
  const isNegative = durationSeconds.toString().charAt(0) === '-';
  const sign = isNegative ? '-' : '';
  const hourString = Math.trunc(duration.asHours()).toString().padStart(3, '0');
  const minuteString = duration.minutes().toString().padStart(2, '0');
  const secondString = duration.seconds().toString().padStart(2, '0');
  return `${sign}${hourString}:${minuteString}:${secondString}`;
}

function parseDurationString(durationString: string): number {
  const [
    hours,
    minutes,
    seconds,
  ] = durationString.replace(/^-/, '').split(':');
  const sign = (durationString.charAt(0) === '-' ? -1 : 1);
  const hoursValue = parseInt(hours, 10) * 3600;
  const minutesValue = parseInt(minutes, 10) * 60;
  const secondsValue = parseInt(seconds, 10);
  return sign * (hoursValue + minutesValue + secondsValue);
}

watch(
  () => props.canBeNegative,
  (newValue) => {
    if (!newValue && props.modelValue.toString().startsWith('-')) {
      emit('update:modelValue', 0);
    }
  },
);
</script>
