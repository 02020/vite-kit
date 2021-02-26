import { createApp, h } from 'vue';
import App from './App.vue';
import './index.css';

import router from './router';

const app = createApp(App);
app.use(router)
app.mount('#app');

window.print = (...args) => {
  console.log(JSON.stringify(args));
};
