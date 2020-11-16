/** @format */

import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Basemap from 'esri/Basemap';
import TileLayer from 'esri/layers/TileLayer';
import IdentityManager from 'esri/identity/IdentityManager';

import SpatialReference from 'esri/geometry/SpatialReference';
import Point from 'esri/geometry/Point';
 

var layList = [
  // 'http://222.76.242.138/arcgis/rest/services/XM92/DEM_CVA/MapServer',
  'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP/MapServer',
  'http://222.76.242.138/arcgis/rest/services/XM92/LMP/MapServer',
];

const basemap = new Basemap({
  title: 'basemap',
  id: 'basemap',
  baseLayers: layList.map((url) => {
    return new TileLayer({ url });
  }),
});

const token =
  '';

layList.forEach((url) => {
  IdentityManager.registerToken({
    server: url,
    token,
  });
});
const map = new EsriMap({
  basemap,
});

const spatialReference = new SpatialReference({
  wkid: 4326,
});

const point = new Point({
  x: 55555,
  y: 5000,
  spatialReference: spatialReference,
});

const view = new MapView({
  map: map,
  container: 'viewDiv',
  // center: point, // 需要采用 spatialReference
  zoom: 6,
  // spatialReference,
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

view.watch('scale', (ev) => {
  const { xmax, xmin, ymax, ymin } = view.extent;
  if (view.zoom) {
    const resp = {
      scale: view.scale,
      zoom: view.zoom,
      center: view.extent,
      xmax,
      xmin,
      ymax,
      ymin,
      extent: view.extent,
      view: view,
    };
    console.log(resp);
  }
});

export { view, spatialReference };
