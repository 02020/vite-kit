/** @format */
import config from './config';
import GIS from '../../../src/gis/app';
let baseUrl = 'http://g.com/esri/4.15';
const token = 'xG1kzmpbmuGzK4QqZZ_uGwYhyu4Em7MjZNhp2nT-bpIdwW--A8iCt4d_9ytmwsJ3';

const initMapView = (gis) => {
  const init = () => {
    gis.once('init', (view) => {
      console.log('gis-init');

      gis.on('gis-create-edit', (ev) => {});

      gis.on('gis-zoom', console.log);
      gis.on('gis-click', (ev) => {
        console.log(ev.mapPoint.x, ev.mapPoint.y);
        console.log(gis.viewInfo())
        // gis.goTo('55555,5000', 6); // 鼓浪屿
      });
    });
  };

  let baseUrl = 'http://g.com/esri/4.15';
  GIS.initArcGisJsApi(baseUrl).then(() => {
    console.log('initArcGisJsApi-ko');
    gis.withFontsUrl('http://www.ztgis.com:8868/arcgis_js_api/fonts');

    gis.initMapView({
      container: 'viewMap',
      extent: '55555,5000,60000,6000',
      wkt: 'PROJCS["92xiamen",GEOGCS["GCS_Krasovsky_1940",DATUM["D_Krasovsky_1940",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",100000.0],PARAMETER["False_Northing",-2700000.0],PARAMETER["Central_Meridian",118.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
   
      widgets: {
        Measurement: {},
      },
      layerList: config.baseList,
    });

    init();
  });
};

// 
const initSrCode = (gis) => {
  gis
    .init({
      url: baseUrl,
      token: token,
      extent: '55555,5000,56555,5500',
      srCode: 'xiamen92',
      layerList: config.baseList,
      widgets: {
        Measurement: {},
      },
    })
    .then((me) => {
      console.log('_init_', me);
      me.on('gis-create-edit', (ev) => {});

      me.on('gis-zoom', console.log);
      me.on('gis-click', (ev) => {
        console.log(me.viewInfo())
        console.log(ev.mapPoint.x, ev.mapPoint.y);
      });

      me.addMany(config.layerList);
    });
};

export default function () {
  const gis = new GIS();
  initMapView(gis);
  // initSrCode(gis)

  window.gis = gis;
}
