/** @format */
import { xm92,layerList } from './mock/92';
import GIS from '../src/gis/app';
let baseUrl = 'http://g.com/esri/4.15';
const token = '';
// me.withFontsUrl('http://www.ztgis.com:8868/arcgis_js_api/fonts');
 
 

export default function () {
  const gis = new GIS();

  window.gis = gis;

  gis
    .init({
      url: baseUrl,
      token: token,
      extent: '26920.6636,-2179.8415,93151.5846,56361.4883',
      srCode: 'xiamen92',
      layerList: xm92,
    })
    .then((me) => {
      console.log('_init_', me);
      me.on('gis-create-edit', (ev) => {});

      me.on('gis-zoom', console.log);
      me.on('gis-click', (ev) => {
        console.log(ev.mapPoint.x, ev.mapPoint.y);
        // me.goTo([118.06,24.444])
      });
 
      me.addMany(layerList)
      
    });
}
