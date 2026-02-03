<template>
  <MenuGeneral @add="addItem" @reset-clear="resetClear" class="z-50" />
  <template :key="key" v-for="(item, key) in elementMap">
    <template v-if="item">
      <div v-if="item.type === 'test'">
        {{ item.text }}
      </div>
      <div v-else-if="item.type === 'timer'">
        <ElementTimer :element="item" @delete="deleteItem" />
      </div>
      <div v-else-if="item.type === 'browser'">
        <ElementBrowser :element="item" @delete="deleteItem" />
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import MenuGeneral from '@/component/menu-general.vue';
import { ELocalStorageKey, localStorageGet, localStorageSet } from '@/util/storage';
import type { TElementID, TElementType, TPossibleElementType } from '@/type/element';
import { onBeforeUnmount, onMounted, shallowRef, triggerRef } from 'vue';
import ElementTimer from '@/component/element-timer.vue';
import { useSocket } from '@/composable/use-socket';
import ElementBrowser from './component/element-browser.vue';
import { addGlobalMouseListener, removeGlobalMouseListener } from './composable/global-controller';

useSocket();

const elementMap = shallowRef(localStorageGet(ELocalStorageKey.ELEMENT_LIST));

function addItem(type: TElementType) {
  elementMap.value = localStorageGet(ELocalStorageKey.ELEMENT_LIST);
  let newElement: TPossibleElementType;
  let exhaustiveCheck: never;
  switch (type) {
    case 'test': {
      newElement = {
        id: Math.random().toString() as TElementID,
        type: 'test',
        text: Math.random().toString(),
      }
      break;
    }
    case 'timer': {
      newElement = {
        id: Math.random().toString() as TElementID,
        type: 'timer',
      };
      break;
    }
    case 'browser': {
      newElement = {
        id: Math.random().toString() as TElementID,
        type: 'browser',
      };
      break;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustiveCheck = type;
      // should not be reachable, but is required for TS
      newElement = {
        id: Math.random().toString() as TElementID,
        type: 'test',
        text: Math.random().toString(),
      };
    }
  }
  elementMap.value[newElement.id] = newElement;
  localStorageSet(ELocalStorageKey.ELEMENT_LIST, elementMap.value);
}

function resetClear() {
  localStorageSet(ELocalStorageKey.ELEMENT_POSITIONS, {} as any);
  localStorageSet(ELocalStorageKey.ELEMENT_LIST, {} as any);
  elementMap.value = {} as any;
}

function deleteItem(elementId: TElementID) {
  elementMap.value = localStorageGet(ELocalStorageKey.ELEMENT_LIST);
  const elementPositions = localStorageGet(ELocalStorageKey.ELEMENT_POSITIONS);
  delete elementMap.value[elementId];
  delete elementPositions[elementId];
  localStorageSet(ELocalStorageKey.ELEMENT_POSITIONS, elementPositions);
  localStorageSet(ELocalStorageKey.ELEMENT_LIST, elementMap.value);
  triggerRef(elementMap);
}

onMounted(() => {
  addGlobalMouseListener();
})

onBeforeUnmount(() => {
  removeGlobalMouseListener();
})
</script>
