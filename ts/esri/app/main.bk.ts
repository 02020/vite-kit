/** @format */

import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Basemap from 'esri/Basemap';
import MapImageLayer from 'esri/layers/MapImageLayer';
import TileLayer from 'esri/layers/TileLayer';
import IdentityManager from 'esri/identity/IdentityManager';
import Measurement from 'esri/widgets/Measurement';
import SpatialReference from 'esri/geometry/SpatialReference';
import Point from 'esri/geometry/Point';

let url =
  'http://222.76.242.138/arcgis/rest/services/Metadata/JTB_ALL/MapServer';

const imageryLayer = new MapImageLayer({
  imageFormat: 'png32',
  // compressionQuality: 100,
  // dpi :300,
  sublayers: [
    { visible: true, id: 0 },
    { visible: true, id: 1 },
    { visible: false, id: 2 },
    { visible: false, id: 3 },
    { visible: false, id: 4 },
  ],
  url,
});

var layList = [
  'http://222.76.242.138/arcgis/rest/services/CGCS_XMMAP/MapServer',
  'http://222.76.242.138/arcgis/rest/services/CGCS_XMMAP_CVA/MapServer',
];

const basemap = new Basemap({
  title: 'basemap',
  id: 'basemap',
  baseLayers: layList.map((url) => {
    return new TileLayer({ url });
  }),
});

const token =
  'w5hvdDc1j8ib2VfKVCkH3YvuvSAD8e1PdRUmV2d8lgy7ZizswJwQjXSi4pbN2UVQ';


layList.forEach((url) => {
  IdentityManager.registerToken({
    server: url,
    token,
  });
});

const map = new EsriMap({
  basemap,
});

// setTimeout(() => {
//   map.add(imageryLayer);
// }, 3000);

const spatialReference = new SpatialReference({
  wkid: 4490,
});

const point = new Point({
  x: 118.06,
  y: 24.444,
  spatialReference: spatialReference,
});

const view = new MapView({
  map: map,
  container: 'viewDiv',
  // center: [118.06, 24.444],  // 定位不生效
  center: point, // 需要采用 spatialReference
  zoom: 6,
  spatialReference,
});

view.when(() => {
  view.on('click', (ev) => {
    let pt = view.toMap(ev.screenPoint);
    console.log(pt.x, pt.y);
    view.hitTest(ev).then((resp) => {
      console.log(resp);
    });
  });
});


const measurement = new Measurement({
  view: view,
  activeTool: "distance"
});
view.ui.add(measurement, "top-right");


setTimeout(() => {
  measurement.activeTool = 'area';
}, 3000);


export { view, spatialReference };
