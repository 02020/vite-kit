/** @format */

let baseList = [
  {
    i: 1,
    id: '影像底图(2019年11月航拍)',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP/MapServer',
    type: 'tile',
  },
  {
    i: 2,
    id: '影像注记',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP_CIA/MapServer',
    type: 'tile',
  },
  {
    i: 0,
    id: '晕渲电子地图注记',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DEM_CVA/MapServer',
    type: 'tile',
    desc: 'xiamen92_short',
  },
  {
    i: 4,
    id: '晕渲电子地图底图 ',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/DEMMAP/MapServer',
    type: 'tile',
  },
  {
    i: 5,
    id: '矢量电子地图',
    url: 'http://222.76.242.138/arcgis/rest/services/XM92/XMMAP/MapServer',
    type: 'tile',
    key: 'a',
  },
  {
    i: 6,
    id: 'xiamen92_short',
    url: 'http://222.76.242.138/arcgis/rest/services/YSHJ/CZZSZD/MapServer',
    type: 'map-image',
  },
]
  .filter((x) => x.key === 'a')
  .sort((a, b) => {
    return b.i - a.i;
  });

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

export default { baseList, layerList }; //list;
