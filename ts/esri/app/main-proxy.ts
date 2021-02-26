/** @format */

import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Basemap from 'esri/Basemap';
import MapImageLayer from 'esri/layers/MapImageLayer';
import TileLayer from 'esri/layers/TileLayer';
import FeatureLayer from 'esri/layers/FeatureLayer';
import IdentityManager from 'esri/identity/IdentityManager';

import SpatialReference from 'esri/geometry/SpatialReference';

import Config from 'esri/config';
import urlUtils from 'esri/core/urlUtils';

let url = 'http://112.48.134.27:6080/arcgis/rest/services/FWAQYH/FeatureServer/1';

const layList = [url];
// const token = 'b2Rj9eg-3gjqt2-uZq9jEp2_IEzrmSaIpk_PMxd8IpxbCOL5JPbFblqFppkXogg2';
// layList.forEach((url) => {
//   IdentityManager.registerToken({
//     server: url,
//     token,
//   });
// });

// Config.request.proxyUrl = 'http://localhost:8080/Java/proxy.jsp';
urlUtils.addProxyRule
 ({
  urlPrefix: "112.48.134.27:6080",
  proxyUrl: "http://localhost:8080/Java/proxy.jsp"
});

const basemap = new Basemap({
  title: 'basemap',
  id: 'basemap',
  baseLayers: layList.map((url) => {
    return new FeatureLayer({ url });
  }),
});

const map = new EsriMap({
  basemap,
});

const spatialReference = new SpatialReference({
  wkid: 4490,
});

// const point = new Point({
//   x: 118.06,
//   y: 24.444,
//   spatialReference: spatialReference,
// });

const view = new MapView({
  map: map,
  container: 'viewDiv',
  // center: [118.06, 24.444],  // 定位不生效
  //center: point, // 需要采用 spatialReference
  //zoom: 6,
  //spatialReference,
});

export { view, spatialReference };
