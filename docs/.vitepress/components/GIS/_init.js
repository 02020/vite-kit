/** @format */

import GIS from '../../GIS';
import  *  as dataDemo from './data';
const Index = GIS.Index;

function init(container) {
  const gis = new GIS();

  let baseUrl = 'http://www.ztgis.com:8868/arcgis_js_api/library/4.15';
  let mapView = {
    container: container,
    zoom: 12,
    center: '118.133988,24.6598',
    extent: '117.88222076,24.42248132,118.45416620,24.907266363',
    wkid: 4326,
    country: 'DLG',
    widgets: {},
  };

  //   baseUrl = 'https://app.gdeei.cn/arcgis-js-api/library/4.14';
  GIS.initArcGisJsApi(baseUrl).then((a) => {
    gis.initMapView(mapView).then((me) => {});

    gis.on('init', () => {
      // gis.addMany(
      //   xm.map((x, i) => {
      //     let token =
      //       '9k7rvHSkixG7Fhdq39_lE2KCHMhH8nj_geVOkyljy12b4tuIdn8lvlyVfScLCpxb'; //
      //     return {
      //       token,
      //       id: 'xm_' + x.layerType + i,
      //       url: x.layerUrl,
      //       copyright: x.layerName,
      //       visible: true,
      //       type: 'tile',
      //       group: 'xm',
      //     };
      //   })
      // );
    });
  });

  return gis;
}
export default init
export { Index, dataDemo, init };
