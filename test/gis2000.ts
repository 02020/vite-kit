/** @format */
import { baseList, domList, dlgList, demList  } from './mock/2000';
import GIS from '../gis/app';

export default function () {
  let mapView2000_Country = {
    container: 'viewMap2000',
    tileInfo: true,
    zoom: 11,
    center: '118.06,24.444',
    wkid: 4490,
    country: 'DLG',
    widgets: {},
  };

  let mapView2000 = {
    container: 'viewMap2000',
    tileInfo: true,
    zoom: 2,
    center: '118.06,24.444',
    wkid: 4490,
    country: 0,
    widgets: {
      Measurement: {},
    },
    layerList: dlgList,
  };

  const gis = new GIS();
  console.log('gis', gis);
  window.gis = gis;

  const init = () => {
    gis.once('init', (view) => {
      console.log('gis-init');
  
  
      gis.on('gis-create-edit', (ev) => {});
      // gis
      //   .shape()
      //   .withPoint({ x: 118.06, y: 24.45 })
      //   .withSymbol(64, 'http://g.com/ui/user/1.png')
      //   .withTitle('{title}')
      //   .build();

      gis.on('gis-zoom', console.log);
      gis.on('gis-click', (ev) => {
        console.log(ev.mapPoint.x, ev.mapPoint.y);
        // gis.goTo({ x: 118.143, y: 24.451 }, 15);
        // gis.goTo("55555,5000");  // 鼓浪屿
      });
      // gis.goTo([118.06, 24.444], 15);  // 鼓浪屿

      setTimeout(() => {}, 3000);
    });
  };

  let baseUrl = 'http://g.com/esri/4.15';
  GIS.initArcGisJsApi(baseUrl).then(() => {
    console.log('object');
    gis.withFontsUrl("http://www.ztgis.com:8868/arcgis_js_api/fonts")
    gis.initMapView(mapView2000);
    init();
  });
}
