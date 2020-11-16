/** @format */

import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

import Test from './components/hello'

import router from './router';

const app = createApp(App);
app.use(router).use(Test);
app.mount('#app');

window.print = (...args) => {
  console.log(JSON.stringify(args));
};


