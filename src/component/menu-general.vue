<template>
  <ElementCore :component-id="COMPONENT_ID" :can-delete="false">
    <template #header>
      <button
        type="button"
        class="w-button-icon"
        @click="selectType = !selectType"
        v-tooltip="'Add new window'"
      >
        <i class="pi pi-plus" />
      </button>
      <button type="button" class="w-button-icon" @click="createRoom" v-tooltip="'Create room'">
        <i class="pi pi-step-forward-alt" />
      </button>
      <button type="button" class="w-button-icon" @click="joinRoom = !joinRoom" v-tooltip="'Join room'">
        <i class="pi pi-play" />
      </button>
      <button
        type="button"
        class="mx-4 w-button-icon w-button-icon_danger"
        @click="emit('reset-clear')"
        v-tooltip="'DANGER: reset & clear all windows'"
      >
        <i class="pi pi-exclamation-circle" />
      </button>
      <a
        class="shrink-0"
        href="http://discord.gg/4pAqWvq"
        target="_blank"
        style="
          padding: var(--button-padding);
          background: transparent;
          border: 1px solid darkorange;
          border-radius: 4px;
        "
      >
        <img
          src="@/assets/wanderers-corp.webp"
          style="width: var(--button-font-size); height: var(--button-font-size)"
        />
      </a>
      <button
        type="button"
        class="w-button-icon"
        @click="minimize"
        v-tooltip="'Hide'"
      >
        <i class="pi pi-minus" />
      </button>
      <button
        type="button"
        class="w-button-icon"
        @click="close"
        v-tooltip="'Close'"
      >
        <i class="pi pi-times" />
      </button>
    </template>
    <div>
      <div v-if="selectType" class="flex gap-1 p-1">
        <button
          class="w-button-icon"
          type="button"
          @click="
            emit('add', 'timer');
            selectType = false;
          "
        >
          <i class="pi pi-clock" />
        </button>
        <button
          class="w-button-icon"
          type="button"
          @click="
            emit('add', 'test');
            selectType = false;
          "
        >
          <i class="pi pi-eject" />
        </button>
        <button
          class="w-button-icon"
          type="button"
          @click="
            emit('add', 'browser');
            selectType = false;
          "
        >
          <i class="pi pi-map" />
        </button>
      </div>
      <div v-else-if="joinRoom" class="flex gap-2">
        <PrmInputText v-model="roomID" />
        <PrmButton>
          <i class="pi pi-play" />
        </PrmButton>
      </div>
      <PrmInputText v-else-if="showCreateRoom" :model-value="roomId" :disabled="roomIsCreating" />
    </div>
  </ElementCore>
</template>

<script setup lang="ts">
import type { TElementID, TElementType } from '@/type/element';
import ElementCore from './element-core.vue';
import { shallowRef } from 'vue';
import PrmInputText from 'primevue/inputtext';
import { useSocket } from '@/composable/use-socket';
import { axiosClient } from '@/api/client';
import PrmButton from 'primevue/button';

const COMPONENT_ID: TElementID = 'menu-general' as TElementID;

const emit = defineEmits<{
  (e: 'add', type: TElementType): void;
  (e: 'reset-clear'): void;
  (e: 'room:create'): void;
  (e: 'room:join'): void;
}>();

useSocket();

const selectType = shallowRef(false);
const joinRoom = shallowRef(false);
const roomID = shallowRef('');

const showCreateRoom = shallowRef(false);
const roomIsCreating = shallowRef(false);
const roomId = shallowRef('');

async function createRoom() {
  showCreateRoom.value = true;
  roomIsCreating.value = true;
  roomId.value = (await axiosClient.post('/rooms')).data;
  roomIsCreating.value = false;
}

function minimize() {
  console.trace('minimise');
  window.electronAPI.minimize();
}

function close() {
  window.electronAPI.close();
}
</script>
