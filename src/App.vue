<template>
  <div>
    <div class="flex gap-2 items-center" v-for="item in formList" :key="item.id">
      <label class="flex items-center gap-2">
        <PrmInputText v-model="item.displayName" size="small" style="width: 100px" placeholder="имя" :readonly="!item.edit" :disabled="!item.edit"/>
      </label>
      <div class="flex flex-col" v-if="item.edit">
        <PrmSelect
          :options="timerTypeOptions"
          v-model="item.type"
          option-value="id"
          option-label="displayName"
          size="small"
        />
      </div>
      <!--
      <label class="flex items-center gap-2">
        <PrmRadioButton v-model="timerType" name="timerType" :value="('duration' as TTimerType)" />
        <div>Время</div>
      </label>
      -->
      <template v-if="item.edit || !item.startedAt">
        <div class="flex flex-col" v-if="item.type === 'range'">
          <PrmInputNumber :useGrouping="false" v-model="item.valueMin" style="width: 60px" placeholder="мин" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
          <PrmInputNumber :useGrouping="false" v-model="item.valueMax" style="width: 60px" placeholder="макс" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
        </div>
        <div v-else-if="item.type === 'seconds'">
          <PrmInputNumber :useGrouping="false" v-model="item.value" placeholder="секунды" size="small" :disabled="!item.edit" :input-style="{ width: '60px'}" />
        </div>
        <div v-else-if="item.type === 'duration'">
          <InputDuration
            v-model="item.value"
            size="small"
            style="width: 50px"
            placeholder="Время"
            :disabled="!item.edit"
          />
        </div>
      </template>

      <div v-if="!item.edit && item.startedAt">
        <div v-if="item.finished" style="background-color: red;">
          finished
        </div>
        <template v-else>
          <PrmInputText
            v-if="item.type === 'seconds' || item.type === 'duration'"
            :model-value="getDurationLeft(item, item.value).format('H:mm:ss')"
            disabled
            readonly
            size="small"
              style="width: 70px"
            :style="{
              ...getStyle(item),
            }"
          />
          <div class="flex flex-col" v-else-if="item.type === 'range'">
            <PrmInputText
              :model-value="getDurationLeft(item, item.valueMin).format('H:mm:ss')"
              disabled
              readonly
              style="width: 70px"
              size="small"
              :style="{
                ...getStyle(item),
              }"
            />
            <PrmInputText
              :model-value="getDurationLeft(item, item.valueMax).format('H:mm:ss')"
              disabled
              readonly
              style="width: 70px"
              size="small"
              :style="{
                ...getStyle(item),
              }"
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
    <div class="flex items-end gap-2">
      <PrmButton
        class="shrink-0"
        @click="addNewItem"
        icon="pi pi-plus"
        iconPos="right"
        size="small"
      />
      <a
        class="shrink-0"
        href="http://discord.gg/4pAqWvq"
        target="_blank"
      >
        <img
          class="p-button p-button-sm p-button-icon-only"
          src="./assets/wanderers-corp.webp"
          style="padding: 0; margin: 0; background: transparent; border-color: orange"
        >
      </a>
      <div class="shrink-0">
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
      <div class="w-auto">
        <div>
          Предупреждение:
        </div>
        <PrmSelect v-model="selectedWarningAudio" :options="Object.keys(audioMap)" />
      </div>
      <div>
        <div>
          Алярма:
        </div>
        <PrmSelect v-model="selectedAlarmAudio" :options="Object.keys(audioMap)" />
      </div>
    </div>
    <!-- Footer end -->
  </div>
</template>

<script setup lang="ts">
import PrmButton from "primevue/button";
import PrmInputNumber from "primevue/inputnumber";
import { CSSProperties, onBeforeMount, onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";
import dayjs from 'dayjs';
import duration, { Duration } from 'dayjs/plugin/duration';
import PrmInputText from "primevue/inputtext";
import { LOCAL_STORAGE_KEY_AUDIO, LOCAL_STORAGE_KEY_TIMERS } from "./util/constant";
import { MenuItem } from "primevue/menuitem";
import { getCurrentWindow } from "@tauri-apps/api/window";
import PrmMenu from "primevue/menu";
import PrmSelect from "primevue/select";

import Sound1 from "./assets/sounds/ohja.mp3";
import Sound2 from "./assets/sounds/risok_0.mp3";
import Sound3 from "./assets/sounds/risok_1.mp3";
import Sound4 from "./assets/sounds/risok_2.mp3";
import Sound5 from "./assets/sounds/risok_3.mp3";
import Sound6 from "./assets/sounds/risok_4.mp3";
import Sound7 from "./assets/sounds/sakata_1.mp3";
import Sound8 from "./assets/sounds/vetsalo_4_resolve.mp3";
import Sound9 from "./assets/sounds/vetsalo_4.mp3";
import Sound10 from "./assets/sounds/vetsalo_5_resolve.mp3";
import Sound11 from "./assets/sounds/vetsalo_5.mp3";
import InputDuration from "./component/input-duration.vue";

dayjs.extend(duration);

type TSoundKey = string;
// too lazy to do globImport with resolving
const audioMap: Record<TSoundKey, HTMLAudioElement> = {
  "ohja": new Audio(Sound1),
  "risok_0": new Audio(Sound2),
  "risok_1": new Audio(Sound3),
  "risok_2": new Audio(Sound4),
  "risok_3": new Audio(Sound5),
  "risok_4": new Audio(Sound6),
  "sakata_1": new Audio(Sound7),
  "vetsalo_4_resolve": new Audio(Sound8),
  "vetsalo_4": new Audio(Sound9),
  "vetsalo_5_resolve": new Audio(Sound10),
  "vetsalo_5": new Audio(Sound11),
}

type TTimerType = 'seconds' | 'range' | 'duration';
const timerTypeOptions: {
  id: TTimerType,
  displayName: string,
}[] = [
  {
    id: 'seconds',
    displayName: 'Секунды',
  },
  {
    id: 'range',
    displayName: 'Промежуток',
  },
  {
    id: 'duration',
    displayName: 'Время',
  },
];
interface ITimer {
  id: number,
  displayName: string,
  type: TTimerType,
  edit: boolean,
  startedAt?: Date,
  finished: boolean,
}
interface ITimerSeconds extends ITimer {
  type: 'seconds' | 'duration',
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
const audioLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_AUDIO) || '{}');
const selectedWarningAudio = shallowRef<keyof typeof audioMap>(audioLocalStorage?.warning ?? 'vetsalo_4');
const selectedAlarmAudio = shallowRef<keyof typeof audioMap>(audioLocalStorage?.alarm ?? 'vetsalo_5_resolve');

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

function getDurationLeft(item: TTimerUnion, seconds: number) {
  return dayjs.duration(dayjs(item.startedAt).add(seconds, 'seconds').diff(dateNow.value));
}

function timerValid(item: TTimerUnion) {
  let valid = !!item.displayName;

  const type = item.type;
  // @ts-ignore
  let exhaustiveCheck: never;
  switch(type) {
    case 'duration':
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
    default:
      exhaustiveCheck = type;
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
function getStyle(item: TTimerUnion): CSSProperties {
  let duration: Duration = dayjs.duration(0);
  const type = item.type;
  // @ts-ignore
  let exhaustiveCheck: never;
  switch(type) {
    case 'duration':
    case 'seconds':
      duration = getDurationLeft(item, item.value);
      break;
    case 'range':
      duration = getDurationLeft(item, item.valueMin);
      break;
    default:
      exhaustiveCheck = type;
  }
  const secondsLeft = duration.asSeconds();
  if (secondsLeft < 15) {
    return Math.floor(secondsLeft) % 2 === 0
      ? {
        'background-color': 'red',
        color: 'white',
      }
      : {
        'background-color': 'white',
      }
  }
  if (secondsLeft < 60) {
    return {
      'background-color': 'red',
      color: 'white',
    };
  }
  if (secondsLeft < 120) {
    return {
      'background-color': 'orange',
    };
  }
  return {
    'background-color': 'white',
  }
}

onMounted(() => {
  const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY_TIMERS);
  formList.value = localStorageItem
    ? JSON.parse(localStorageItem) as Record<ITimer['id'], TTimerUnion>
    : {};
  intervalID = setInterval(() => {
    dateNow.value = new Date();
    Object.values(formList.value)
      .forEach((_item) => {
        if (_item.finished || !_item.startedAt) {
          return;
        }
        const type = _item.type;
        // @ts-ignore
        let exhaustiveCheck: never;
        switch(type) {
          case 'duration':
          case 'seconds': {
            const seconds = getDurationLeft(_item, _item.value).asSeconds();
            if (seconds < 15 && seconds > 14) {
              audioMap[selectedWarningAudio.value].play();
            }
            if (seconds <= 0) {
              audioMap[selectedAlarmAudio.value].play();
              _item.finished = true;
            }
            break;
          }
          case 'range': {
            const secondsMin = getDurationLeft(_item, _item.valueMin).asSeconds();
            const secondsMax = getDurationLeft(_item, _item.valueMax).asSeconds();
            if (secondsMin < 15 && secondsMin > 14) {
              audioMap[selectedWarningAudio.value].play();
            }
            if (secondsMin <= 0) {
              audioMap[selectedAlarmAudio.value].play();
            }
            if (secondsMax <= 0) {
              _item.finished = true;
            }
            break;
          }
          default:
            exhaustiveCheck = type;
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
    localStorage.setItem(LOCAL_STORAGE_KEY_TIMERS, JSON.stringify(formList.value));
  },
  {
    deep: true,
  }
)

watch(
  [
    selectedWarningAudio,
    selectedAlarmAudio,
  ],
  ([
    warning,
    alarm,
  ]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_AUDIO, JSON.stringify({
      warning,
      alarm
    }));
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