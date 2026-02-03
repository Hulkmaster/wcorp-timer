import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import PrmTheme from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';

import './style/tailwind.css';
import './style/primevue.css';
import './style/common.scss';

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: PrmTheme,
      options: {
        darkModeSelector: '.app_dark',
      },
    },
  })
  .use(ConfirmationService)
  .directive('tooltip', Tooltip)
  .mount('#app');
