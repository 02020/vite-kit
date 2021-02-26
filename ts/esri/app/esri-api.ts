import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Basemap from 'esri/Basemap';
import MapImageLayer from 'esri/layers/MapImageLayer';
import TileLayer from 'esri/layers/TileLayer';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import WebTileLayer from 'esri/layers/WebTileLayer';
import MapNotesLayer from 'esri/layers/MapNotesLayer';
import ImageryLayer from 'esri/layers/ImageryLayer';

import IdentityManager from 'esri/identity/IdentityManager';
import Measurement from 'esri/widgets/Measurement';
import SpatialReference from 'esri/geometry/SpatialReference';
import Point from 'esri/geometry/Point';







/**
 * Create a layer from properties;
 * @param props layer's properties
 */
export function createLayer(props: any) {
  const layerType = props.type;
  delete props.type;
  let layer: any;
  switch (layerType) {
    case 'feature':
      layer = new FeatureLayer(props);
      break;
    case 'graphics':
      layer = new GraphicsLayer(props);
      break;
    case 'tile':
      let sublayers: __esri.SublayerProperties[];
      if (!!props.sublayers) {
        sublayers = props.sublayers;
        delete props.sublayers;
      }
      layer = new TileLayer(props);
      if (!!sublayers && sublayers.length) {
        const tile = (layer as unknown) as __esri.TileLayer;
        for (const sub of sublayers) {
          const _layer = tile.sublayers.find((l) => l.id === sub.id);
          _layer.title = sub.title;
          _layer.legendEnabled = sub.legendEnabled;
          _layer.popupEnabled = sub.popupEnabled;
          _layer.popupTemplate = sub.popupTemplate as any;
        }
      }
      break;
    case 'web-tile':
      layer = new WebTileLayer(props);
      break;
    case 'imagery':
      layer = new ImageryLayer(props);
      break;
    case 'map-image':
      props.imageFormat = 'png32';
      layer = new MapImageLayer(props);
      break;
    case 'map-notes':
      layer = new MapNotesLayer(props);
      break;
    default:
      console.error(props);
      throw new Error(`Unknown layer type: ${layerType}`);
  }
  return layer;
}

const createMapView = (layList: Array<any>, params: any) =>
  new MapView({
    ...params,
    container: 'viewDiv',
    map: new EsriMap({
      basemap: new Basemap({
        title: 'basemap',
        id: 'basemap',
        baseLayers: layList.map(createLayer),
      }),
    }),
  });

export default {
  createLayer,
  createMapView,
};
