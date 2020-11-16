/** @format */

let xm92 = [
  {
    id: '影像底图(2019年11月航拍)',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP/MapServer',
    type: 'tile',
    key: 'a',
  },
  {
    id: '晕渲电子地图注记',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DEM_CVA/MapServer',
    type: 'tile',
    desc: 'xiamen92_short',
  },
  {
    id: '晕渲电子地图底图 ',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DEMMAP/MapServer',
    type: 'tile',
  },
  {
    id: '矢量电子地图',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/XMMAP/MapServer',
    type: 'tile',
  },
  {
    id: '影像底图(2019年11月航拍)',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP/MapServer',
    type: 'tile',
  },
  {
    id: '影像注记',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP_CIA/MapServer',
    type: 'tile',
  },
  {
    id: 'xiamen92_short',
    url: 'http://222.76.242.138/arcgis/rest/services/YSHJ/CZZSZD/MapServer',
    type: 'map-image',
  },
].filter((x) => x.key == 'a');

// 不放在底图加载
const layerList = [
  {
    opacity: undefined,
    id: 'lmp',
    type: 'tile',
    visible: true,
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/LMP/MapServer',
  },
  {
    id: 'xiamen92_short',
    url: 'http://222.76.242.138/arcgis/rest/services/YSHJ/CZZSZD/MapServer',
    type: 'map-image',

    sublayers: [
      { visible: true, id: 0 },
      { visible: false, id: 1 },
    ],
  },
  {
    id: 'lmp',
    // type: 'tile',
    type: 'feature',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/LMP/MapServer/0',
  },
  {
    id: 'edit',
    type: 'feature',
    url0: 'http://222.76.242.138/arcgis/rest/services/YSHJ/CZZSZD/MapServer/0',
    url2: 'http://222.76.242.138/arcgis/rest/services/ZTT/KZD/FeatureServer/0',
    url: 'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1',
    //'http://222.76.242.138/arcgis/rest/services/XM92/XZQH/MapServer/0',
  },

  {
    key: 'a',
    id: '动态服务',
    type: 'map-image',
    url: 'http://www.ztgis.com:6080/arcgis/rest/services/cbzc/cbzc_map/MapServer',
    sublayers: [
      {
        id: 1,
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [255, 128, 0, 0.5],
            outline: {
              width: 1,
              color: 'white',
            },
          },
        },
      },
      {
        id: 2,
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [255, 128, 0, 0.5],
            outline: {
              width: 1,
              color: 'white',
            },
          },
        },
      },
    ],
  },
].filter((x) => x.key == 'a');

export { xm92, layerList }; //list;


/*

// Overrides the drawing info on the layer with a custom renderer
var citiesLayer = layer.sublayers.getItemAt(3);
citiesLayer.renderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    color: "blue",
    size: 3
  }
};


*/