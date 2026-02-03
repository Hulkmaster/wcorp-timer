<template>
  <div ref="root" class="absolute px-2 py-1 rounded bg-black text-white border-white border" :style="style">
    <div class="flex gap-2 items-center">
      <div ref="dragHandle" class="w-button-icon" style="cursor: grab">
        <i class="pi pi-th-large" />
      </div>
      <slot name="header" />
      <button v-if="canDelete" type="button" class="w-button-icon w-button-icon_danger ml-auto" @click="confirmDelete
        ? emit('delete', componentId)
        : (confirmDelete = true)">
        <i v-if="!confirmDelete" class="pi pi-trash" />
        <i v-else class="pi pi-check" />
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useGlobalController } from '../composable/global-controller';
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import { useDraggable } from '@vueuse/core';
import { ELocalStorageKey, localStorageGet, localStorageSet } from '@/util/storage';
import type { TElementID } from '@/type/element';

interface IProps {
  componentId: TElementID;
  canDelete?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  canDelete: true,
});

const emit = defineEmits<{
  (e: 'delete', type: TElementID): void;
}>();

const root = useTemplateRef('root');
const dragHandle = useTemplateRef('dragHandle');
const confirmDelete = shallowRef(false);

const { addElement, removeElement, getInitialAbsolutePosition } = useGlobalController();

const componentPosition = localStorageGet(ELocalStorageKey.ELEMENT_POSITIONS)[props.componentId];

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { style } = useDraggable(root, {
  initialValue: componentPosition ?? getInitialAbsolutePosition(),
  handle: dragHandle,
  preventDefault: true,
  onEnd(position) {
    const componentPositionMap = localStorageGet(ELocalStorageKey.ELEMENT_POSITIONS);
    componentPositionMap[props.componentId] = position;
    localStorageSet(ELocalStorageKey.ELEMENT_POSITIONS, componentPositionMap);
  },
});

onMounted(() => {
  addElement(root.value!);
});

onBeforeUnmount(() => {
  removeElement(root.value!);
});
</script>
