/** @format */
import config from './config';
import GIS from '../../../src/gis/app';
// import GIS from '../../../src/gis/dist/GIS-1.0';
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
        console.log(gis.viewInfo());
      });
    });
  };

  let baseUrl = 'http://g.com/esri/4.15';
  GIS.initArcGisJsApi(baseUrl).then(() => {
    console.log('initArcGisJsApi-ko');
    gis.withFontsUrl('http://www.ztgis.com:8868/arcgis_js_api/fonts');
    // 配置代理路径
    // gis.withProxyRule({
    //   urlPrefix: '112.48.134.27:6080',
    //   proxyUrl: 'http://localhost:8080/Java/proxy.jsp',
    // });

    gis.initMapView({
      container: 'viewMap',
      zoom: 5,
      center: '118.06,24.444',
      extent: '',
      wkid: 4490,
      country: 0, // 不加载国家的服务
      widgets: {
        Measurement: {},
      },
      layerList: config.baseList,
    });

    init();
  });
};

// 2000
const initSrCode = (gis) => {
  gis
    .init({
      url: baseUrl,
      token: token,
      srCode: 'cgcs2000',
      // extent: '118.00,24.00,118.06,24.444',
      extent: '117.882220756,24.422481324,118.454166203,24.90726636',
      layerList: config.baseList,
    })
    .then((me) => {
      console.log('_init_', me);
      me.on('gis-create-edit', (ev) => {});

      me.on('gis-zoom', console.log);
      me.on('gis-click', (ev) => {
        console.log(me.viewInfo());
        console.log(ev.mapPoint.x, ev.mapPoint.y);
      });

      // me.addMany(config.layerList);
    });
};

export default function () {
  const gis = new GIS();
  // initMapView(gis);
  initSrCode(gis);

  window.gis = gis;
}
