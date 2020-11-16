/** @format */

import tileInfo from './tileInfo';
const tdtMapToken = '993470e78cc4324e1023721f57b23640';

const subDomains = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];

export default [
  /**
   * 国家地图服务
   * 矢量 DLG
   * 影像 DOM
   * 晕眩 DEM
   */
  //矢量地图服务{subDomain}
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家矢量地图服务',
    mapType: 'DLG',
    id: 'COUNTRY_DLG01',
    visible:false,
  },

  //矢量注记地图服务
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家矢量注记地图服务',
    mapType: 'DLG',
    id: 'COUNTRY_DLG02', visible:false,
  },
  /**
   * 国家影像地图服务
   */
  //影像地图服务
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家影像地图服务',
    mapType: 'DOM',
    id: 'COUNTRY_DOM01', visible:false,
  },
  //影像注记地图服务
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/cia_c/wmts?&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家影像注记地图服务',
    mapType: 'DOM',
    id: 'COUNTRY_DOM02', visible:false,
  },
  /**
   * 国家晕渲地图服务
   */
  //国家晕渲地图服务
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家晕渲地图服务',
    mapType: 'DEM',
    id: 'COUNTRY_DEM01', visible:false,
  },
  //晕渲注记地图服务
  {
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=' +
      tdtMapToken,
    subDomains: subDomains,
    tileInfo: tileInfo,
    type: 'web-tile',
    spatialReference: {},
    copyright: '国家晕渲注记地图服务',
    mapType: 'DEM',
    id: 'COUNTRY_DEM02', visible:false,
  },

  // //福建地图
  // {
  //     urlTemplate: "http://service.fjmap.net/fujian_ter_20131220/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=fujian_ter_20131220&STYLE=fujian_ter_20131220&TILEMATRIXSET=Matrix_0&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fpng",
  //     tileInfo: tileInfo,
  //     type: "web-tile",
  //     spatialReference:{},
  //     copyright: "福建天地图服务"
  //   }
  //水印图层
  // WatermarkWebTileLayer = new WebTileLayer({
  //   urlTemplate: "img/map/watermaker.png",
  //   tileInfo: tileInfo,
  //   spatialReference: spatialReference,
  //   copyright: "水印图层"
  // });
];
