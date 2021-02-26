import api from './esri-api';
import utils from './utils';

//  'http://222.76.242.138/arcgis/rest/services/XM92/DEM_CVA/MapServer',
// 'http://222.76.242.138/arcgis/rest/services/XM92/DOMMAP/MapServer',
// 'http://222.76.242.138/arcgis/rest/services/XMD92/DOM2014W/MapServer'
// 'http://222.76.242.138/arcgis/rest/services/XM92/XMMAP/MapServer'
// 'http://222.76.242.138/arcgis/rest/services/XM92/LMP/MapServer',

const layList1 = [
  // { type: 'tile', url: "http://172.28.3.16/arcgis/rest/services/XM92/XMMAP/MapServer" },
  { type: 'tile', url: 'http://172.28.3.16/arcgis/rest/services/XM92/DOMMAP/MapServer' },
  // { type: 'tile', url: "http://172.28.3.16/arcgis/rest/services/XM92/LMP/MapServer" },
  { type: 'feature', url: 'http://172.28.3.16/arcgis/rest/services/XM92/TRA/MapServer/0' },
  {
    type: 'map-image',
    url: 'http://172.28.3.16/arcgis/rest/services/Metadata/JTB_ALL/MapServer',
    imageFormat: 'png32',
    // compressionQuality: 100,
    // dpi :300,
    sublayers: [{ visible: true, id: 0 }],
  },
  {
    type: 'map-image',
    url: 'http://172.28.3.16/arcgis/rest/services/Metadata/JTB_ALL/MapServer',
    imageFormat: 'png32',
    sublayers: [{ visible: true, id: 1 }],
  },
];



const layList = [
  {type:'tile',url:'http://172.28.3.16/arcgis/rest/services/CGCS_DEMMAP_CVA/MapServer'},
  { type: 'tile', url: 'http://172.28.3.16/arcgis/rest/services/CGCS_DOM2019J3W/MapServer' },
  {type:'tile',url:'http://172.28.3.16/arcgis/rest/services/CGCS_XMMAP/MapServer'},
]
const token = 'X6U01kWOBorRwcJnfe_bcRq3xg-Wa2lc5cR1nVlOWceQOvYne4oDJt7YqQpjjzgm29OqAwlZwYcBbqYFSNljPA..'


// 'floYmDT6L7eLKPd11ZOjthtrBYbbmVakhyyKmbkGnZ2T_v8vCA8LTtIQjzrCj9cB';
//
utils.registerToken(layList, token);

const view = api.createMapView(layList, {
  zoom: 4,
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

 
/*



*/

// const measurement = new Measurement({
//   view: view,
//   activeTool: "distance"
// });
// view.ui.add(measurement, "top-right");

// setTimeout(() => {
//   measurement.activeTool = 'area';
// }, 3000);

export { view };
