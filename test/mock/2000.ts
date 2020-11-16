const token = 'C_IrJEwZ3JvT56UrIR57o7wO4sHJwaCjEycUfIUIBU6NZ-ORXM0A7rS4CDSfEnAi';

const otherLayers = [
  {
    name: '要素-商品房',
    url: 'http://222.76.242.138/arcgis/rest/services/ZTT/SPFLP/MapServer/0',
    layerType: 'DLG',
    type: 'feature',
    layerDefinitions: '[]',
    scaleEnabled: '1',
    scaleMax: null,
    scaleMin: null,
    isTagLayer: '0',
    opacity: '1',
    isDefault: '0',
    publishYear: '2020',
  },
  {
    name: '动态-厦门市-注记',
    url: 'http://222.76.242.138/arcgis/rest/services/MAP_CVA_DT/MapServer',
    layerType: 'DLG',
    type: 'map-image',
    layerDefinitions:
      '[\r\n    {\r\n        "id": 192,\r\n        "visible": true,\r\n        "definitionExpression": ""\r\n    },\r\n    {\r\n        "id": 191,\r\n        "visible": true\r\n    },\r\n    {\r\n        "id": 190,\r\n        "visible": true\r\n    },\r\n    {\r\n        "id": 189,\r\n        "visible": true\r\n    },\r\n    {\r\n        "id": 188,\r\n        "visible": true\r\n    },\r\n    {\r\n        "id": 187,\r\n        "visible": true\r\n    },\r\n    {\r\n        "id": 186,\r\n        "visible": true\r\n    }\r\n]',
    scaleEnabled: null,
    scaleMax: null,
    scaleMin: null,
    isTagLayer: '1',
    opacity: null,
    isDefault: '1',
    publishYear: '2020',
  },

  {
    name: '动态-接图表-10000',
    url: 'http://222.76.242.138/arcgis/rest/services/JTB10000/MapServer',
    layerType: 'DLG',
    type: 'map-image',
    layerDefinitions: null,
    scaleEnabled: null,
    scaleMax: null,
    scaleMin: null,
    isTagLayer: '0',
    opacity: null,
    isDefault: '0',
    publishYear: '2020',
  },
  {
    name: '测试2',
    url: 'www.ztgis.com:6080/arcgis/rest/services/cbzc/jzw/MapServer',
    layerType: 'DOM',
    type: null,
    layerDefinitions: '[]',
    scaleEnabled: '1',
    scaleMax: null,
    scaleMin: null,
    isTagLayer: '0',
    opacity: '1',
    isDefault: '0',
    publishYear: null,
  },
];

const demList = [
  {
    name: '厦门市DEM',
    url: 'http://222.76.242.138/arcgis/rest/services/CGCS_DEMMAP/MapServer\t',
    layerType: 'DEM',
    type: 'tile',
    publishYear: '2019',
    token,
  },
  {
    name: '厦门市DEM注记',
    url: 'http://222.76.242.138/arcgis/rest/services/CGCS_DEMMAP_CVA/MapServer',
    layerType: 'DEM',
    type: 'tile',
    publishYear: '2019',
    token,
  },
];

const dlgList = [
  {
    name: '厦门市DLG',
    url: 'http://222.76.242.138/arcgis/rest/services/CGCS_XMMAP/MapServer',
    type: 'tile',
    publishYear: '2019',
    token,
  },
  {
    name: '厦门市DLG注记',
    url: 'http://222.76.242.138/arcgis/rest/services/CGCS_XMMAP_CVA/MapServer',
    type: 'tile',
    publishYear: '2019',
    token,
  },
];

let domList = [
  {
    name: '厦门市2016年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2016/MapServer',
    type: 'tile',
    token,
  },
  {
    name: '厦门市2017年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2017/MapServer',
    type: 'tile',
    token,
  },
  {
    name: '厦门市2018年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2018/MapServer',
    type: 'tile',
    token,
  },
  {
    name: '厦门市2019年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2019/MapServer',
    type: 'tile',
    token,
  },
  {
    id: '厦门市2019年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2019/MapServer',
    type: 'tile',
    token,
  },
  {
    name: '厦门市DOM注记',
    url: 'http://222.76.242.138/arcgis/rest/services/CGCS_DOMMAP_CIA/MapServer',
    layerType: 'DOM',
    type: 'tile',
    publishYear: '2019',
    token,
  },
];

let baseList = [];
baseList
  .concat(domList.map((x) => x['layerType'] == 'DOM'))
  .concat(dlgList.map((x) => x['layerType'] == 'DLG'))
  .concat(dlgList.map((x) => x['layerType'] == 'DEM'));

export { baseList, domList, dlgList, demList };
