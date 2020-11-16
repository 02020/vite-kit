/** @format */
 
import './styles/vars.css';
import './styles/layout.css';
import './styles/code.css';
import './styles/custom-blocks.css';
import './styles/index.css';
// import VueHighlightJS from './vue-highlight.es.js';
// import 'highlight.js/styles/atom-one-dark.css';

import Layout from './Layout.vue';
import NotFound from './NotFound.vue';
import Code from './components/base/Code.vue';
import components from '../components/GIS/index';
import * as  GIS from  '../components/GIS/_init'

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    // console.log(siteData);
 
    app.config.globalProperties.GIS = GIS
    // app.component('light-code',VueHighlightJS)
    app.component('Code', Code);

    Object.entries(components).forEach(([key, value]) => {
      app.component('gis-' + key, value);
    });
  },
};
