<template>
  <ElementCore :component-id="element.id" @delete="emit('delete', element.id)">
    <template #header>
      <button
        type="button"
        class="w-button-icon"
        @click="showSettings = !showSettings"
        v-tooltip="'Settings'"
      >
        <i class="pi pi-cog" />
      </button>
    </template>
    <div class="flex items-center gap-2 py-2" v-if="showSettings">
      <div class="flex flex-col">
        <PrmInputText size="small" v-model="inputSrc" />
        {{ zodError }}
      </div>
      <PrmButton icon="pi pi-check" @click="applySrc" size="small" />
    </div>
    <div class="resize overflow-auto max-w-full max-h-full p-2 w-lg">
      <div v-if="showWarning" class="flex flex-col gap-2">
        <PrmMessage severity="error" icon="pi pi-exclamation-triangle">
          I understand that anything within this window is not provided by WCorp: Commanding
          interface.
        </PrmMessage>
        <PrmMessage severity="error" icon="pi pi-exclamation-triangle">
          I understand that anything within this window is based on URL I entered and might contain
          malicious software and other problems.
        </PrmMessage>
        <PrmButton severity="danger" @click="showWarning = false"> Confirm </PrmButton>
      </div>
      <iframe
        v-else
        :src="iframeSrc || ''"
        class="w-full h-full max-w-full max-h-full"
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    </div>
  </ElementCore>
</template>

<script setup lang="ts">
import type { IElementBrowser, TElementID } from '@/type/element';
import { LOCAL_STORAGE_KEY_IFRAME } from '@/util/constant';
import { useLocalStorage } from '@vueuse/core';
import PrmButton from 'primevue/button';
import PrmInputText from 'primevue/inputtext';
import { shallowRef, watch } from 'vue';
import z, { prettifyError } from 'zod';
import ElementCore from './element-core.vue';
import PrmMessage from 'primevue/message';

const props = defineProps<{
  element: IElementBrowser;
}>();

const emit = defineEmits<{
  (e: 'delete', type: TElementID): void;
}>();

const storageSrc = useLocalStorage(`${props.element.id}__${LOCAL_STORAGE_KEY_IFRAME}`, '');
const inputSrc = shallowRef('');
const iframeSrc = shallowRef('');
const zodError = shallowRef<string>();
const showSettings = shallowRef(false);
const showWarning = shallowRef(true);

function applySrc() {
  zodError.value = undefined;
  const result = z.httpUrl().safeParse(inputSrc.value);
  if (!result.success) {
    zodError.value = prettifyError(result.error);
    console.log(zodError.value);
    return;
  }
  iframeSrc.value = inputSrc.value;
  storageSrc.value = inputSrc.value;
}

watch(
  storageSrc,
  (newValue) => {
    inputSrc.value = newValue;
    showSettings.value = !inputSrc.value;
    applySrc();
  },
  {
    immediate: true,
  },
);
</script>
