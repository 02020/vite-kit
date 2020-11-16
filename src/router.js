/** @format */

import { createRouter, createWebHashHistory } from 'vue-router';
import Main from './Main.vue';
import Vue3Test from '../test/Vue3Test.vue';
import GIS from '../test/gis.vue';

let routes = [
  { path: '/', name: 'main', component: Main },
  { path: '/gis', name: 'gis', component: () => import('./test/gis.vue') },
  { path: '/test', name: 'test', component: Vue3Test },
];

// 替换
routes = [{ path: '/', name: 'gis', component: GIS }];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
