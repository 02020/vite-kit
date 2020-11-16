/** @format */

import EsriBus from './bus';
import { viewEvents } from './viewEvents';
import * as arcgis from './esri-api';
import { initModules, modules } from './modules';
import { goTo } from './goTo';
import mitt  from './mitt';
export { axios }  from './http';
export { arcgis, initModules, modules, EsriBus , viewEvents, goTo};

export const emitter = mitt();

export  *  from './utils'