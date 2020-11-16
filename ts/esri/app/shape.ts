/** @format */

import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/Graphic';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';

import { view, spatialReference } from './main';

const layer = new GraphicsLayer();
view.map.add(layer);

let geometry = new Polygon({
  spatialReference,
});

let points = [
  [118.141, 24.45],
  [118.141, 24.451],
  [118.142, 24.451],
  [118.142, 24.452],
  [118.143, 24.452],
  [118.143, 24.451],
  [118.142, 24.45],
  [118.141, 24.45],
];

geometry.addRing(points);
let points2 = points.map((x) => {
  return [x[0] + 0.003, x[1]];
});
geometry.addRing(points2);

let graphic = new Graphic({
  attributes: {
    title: '我是标题',
  },
  symbol: new SimpleFillSymbol({
    color: '#cef',
    style: 'cross',
    outline: {
      style: 'dash',
      color: '#abc',
      width: 2,
    },
  }),
  geometry
});

layer.add(graphic);

let highlight: __esri.Handle;

view.whenLayerView(layer).then((layerView) => {
  highlight && highlight.remove();
  highlight = layerView.highlight(graphic);

  view.goTo({
    target: graphic,
    zoom: 7,
  });


});



/*

  view.popup.open({
    title: "{title}",
    features: [graphic],
  });


*/