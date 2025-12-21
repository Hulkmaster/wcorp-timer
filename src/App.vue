<template>
  <div>
    <div class="flex gap-2 items-center" v-for="item in formList" :key="item.id">
      <label class="flex items-center gap-2">
        <PrmInputText v-model="item.displayName" size="small" style="width: 100px" placeholder="имя" :readonly="!item.edit" :disabled="!item.edit"/>
      </label>
      <div class="flex flex-col" v-if="item.edit">
        <label class="flex items-center gap-2">
          <PrmRadioButton v-model="item.type" name="timerType" :value="('seconds' as TTimerType)" />
          <div>Секунды</div>
        </label>
        <label class="flex items-center gap-2">
          <PrmRadioButton v-model="item.type" name="timerType" :value="('range' as TTimerType)" />
          <div>Промежуток</div>
        </label>
      </div>
      <!--
      <label class="flex items-center gap-2">
        <PrmRadioButton v-model="timerType" name="timerType" :value="('duration' as TTimerType)" />
        <div>Время</div>
      </label>
      -->
      <template v-if="item.edit || !item.startedAt">
        <div class="flex flex-col" v-if="item.type === 'range'">
          <PrmInputNumber :useGrouping="false" v-model="item.valueMin"  placeholder="мин секунды" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
          <PrmInputNumber :useGrouping="false" v-model="item.valueMax" style="width: 50px" placeholder="макс секунды" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
        </div>
        <div v-else-if="item.type === 'seconds'">
          <PrmInputNumber :useGrouping="false" v-model="item.value" placeholder="секунды" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
        </div>
      </template>

      <div v-if="!item.edit && item.startedAt">
        <template v-if="item.finished">
          finished
        </template>
        <template v-else>
          <PrmInputText
            v-if="item.type === 'seconds'"
            :model-value="dayjs.duration(dayjs(item.startedAt).add(item.value, 'seconds').diff(dateNow)).format('mm:ss')"
            disabled
            readonly
            style="width: 60px"
            size="small"
          />
          <div class="flex flex-col" v-else>
            <PrmInputText
              :model-value="dayjs.duration(dayjs(item.startedAt).add(item.valueMin, 'seconds').diff(dateNow)).format('mm:ss')"
              disabled
              readonly
              style="width: 60px"
              size="small"
            />
            <PrmInputText
              :model-value="dayjs.duration(dayjs(item.startedAt).add(item.valueMax, 'seconds').diff(dateNow)).format('mm:ss')"
              disabled
              readonly
              style="width: 60px"
              size="small"
            />
          </div>
        </template>
      </div>
      <div class="flex flex-col gap-1" v-if="!item.edit">
        <div class="flex gap-1">
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).add(1, 'seconds').toDate()" label="+1" size="small" />
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).add(5, 'seconds').toDate()" label="+5" size="small" />
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).add(10, 'seconds').toDate()" label="+10" size="small" />
        </div>
        <div class="flex gap-1">
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).subtract(1, 'seconds').toDate()" label="-1" size="small" />
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).subtract(5, 'seconds').toDate()" label="-5" size="small" />
          <PrmButton class="grow" style="padding: 0" @click="item.startedAt = dayjs(item.startedAt).subtract(10, 'seconds').toDate()" label="-10" size="small" />
        </div>
      </div>
      <PrmButton
        v-if="item.edit"
        @click="item.edit = false"
        icon="pi pi-check"
          size="small"
        :disabled="!timerValid(item)"
      />
      <template v-else>
        <PrmButton
          v-if="item.startedAt"
          @click="item.startedAt = undefined"
          icon="pi pi-stop"
          iconPos="right"
          size="small"
        />
        <PrmButton
          v-else
          @click="item.startedAt = new Date(); item.finished = false"
          icon="pi pi-play"
          size="small"
        />
        <PrmButton
          @click="item.startedAt = new Date(); item.finished = false"
          icon="pi pi-refresh"
          size="small"
        />
        <PrmButton
          @click="item.edit = true"
          icon="pi pi-pencil"
          size="small"
        />
      </template>
      <PrmButton
        @click="delete formList[item.id]"
        icon="pi pi-trash"
        severity="danger"
        size="small"
      />
    </div>

    <!-- Footer start -->
    <div class="flex items-center gap-2">
      <PrmButton
        @click="addNewItem"
        icon="pi pi-plus"
        iconPos="right"
        size="small"
      />
      <a
        href="http://discord.gg/4pAqWvq"
        target="_blank"
      >
        <img
          class="p-button p-button-sm p-button-icon-only"
          src="./assets/wanderers-corp.webp"
          style="padding: 0; margin: 0; background: transparent; border: lightgrey"
        >
      </a>
      <div>
        <PrmButton
          type="button"
          size="small"
          icon="pi pi-ellipsis-v"
          @click="toggleMenu"
        />
        <PrmMenu
          ref="menu"
          size="small"
          :model="items"
          :popup="true"
        />
      </div>
    </div>
    <!-- Footer end -->
  </div>
</template>

<script setup lang="ts">
import PrmButton from "primevue/button";
import PrmInputNumber from "primevue/inputnumber";
import PrmRadioButton from "primevue/radiobutton";
import { onBeforeMount, onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import PrmInputText from "primevue/inputtext";
import { LOCAL_STORAGE_KEY } from "./util/constant";
import { MenuItem } from "primevue/menuitem";
import { getCurrentWindow } from "@tauri-apps/api/window";
import PrmMenu from "primevue/menu";

dayjs.extend(duration);

type TTimerType = 'seconds' | 'range' | 'duration';
interface ITimer {
  id: number,
  displayName: string,
  type: TTimerType,
  edit: boolean,
  startedAt?: Date,
  finished: boolean,
}
interface ITimerSeconds extends ITimer {
  type: 'seconds',
  value: number,
}
interface ITimerRange extends ITimer {
  type: 'range',
  valueMin: number,
  valueMax: number,
}
type TTimerUnion = ITimerSeconds | ITimerRange;

const dateNow = shallowRef(new Date());
const formList = ref<Record<ITimer['id'], TTimerUnion>>({});
let intervalID: number;

function addNewItem() {
  const id = Math.random();
  formList.value[id] = {
    id,
    type: 'seconds',
    displayName: '',
    value: 0,
    edit: true,
    finished: false,
  };
}

function timerValid(item: TTimerUnion) {
  let valid = !!item.displayName;

  switch(item.type) {
    case 'seconds': {
      valid = !!item.value;
      break;
    }
    case 'range': {
      valid = !!item.valueMax;
      valid = !!item.valueMin;
      valid = item.valueMax > item.valueMin;
      break;
    }
  }

  return valid;
}

const menu = useTemplateRef('menu');
const items = shallowRef<MenuItem[]>([
  {
    items: [
      {
        label: 'Decorations',
        async command() {
          getCurrentWindow().setDecorations(!(await getCurrentWindow().isDecorated()));
        },
      },
    ],
  },
]);
function toggleMenu(event: Event) {
  menu.value?.toggle(event);
};

onMounted(() => {
  const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY);
  formList.value = localStorageItem
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '') as Record<ITimer['id'], TTimerUnion>
    : {};
  intervalID = setInterval(() => {
    dateNow.value = new Date();
    Object.values(formList.value)
      .forEach((_item) => {
        if (_item.finished || !_item.startedAt) {
          return;
        }
        switch(_item.type) {
          case 'seconds': {
            if (dayjs.duration(dayjs(_item.startedAt).add(_item.value, 'seconds').diff(dateNow.value)).asSeconds() <= 0) {
              _item.finished = true;
            }
            break;
          }
          case 'range': {
            if (dayjs.duration(dayjs(_item.startedAt).add(_item.valueMax, 'seconds').diff(dateNow.value)).asSeconds() <= 0) {
              _item.finished = true;
            }
            break;
          }
        }
      })
  }, 500)
})
onBeforeMount(() => {
  clearInterval(intervalID);
})

watch(
  formList,
  () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formList.value));
  },
  {
    deep: true,
  }
)
</script>

<style lang="css">
body {
  color: white;
}

.p-micro-button {
  padding: 2px;
}
</style>