/** @format */

import { modules } from '../core';
import { createSymbol, Shape } from '../graphic';

/**
 *  MapView 事件
 */
const MAP_VIEW_EVENTS = [
  'blur',
  'click',
  'double-click',
  'drag',
  'focus',
  'hold',
  'mouse-wheel',
  'resize',
  'pointer-move',
];

/**
 * 绘图事件
 */
const DRAW_EVENTS = ['point', 'multipoint', 'polyline', 'polygon', 'rectangle'];

/**
 * 注册地图事件, 加载地图的时候使用
 * @param {*} view
 * @param {*} bus
 * @param {*} current
 */
const esriEmit = (view, bus, gis, current = 'gis') => {
  bus.view = view;

  for (var i = 0; i < MAP_VIEW_EVENTS.length; i++) {
    const eventName = MAP_VIEW_EVENTS[i];
    view.on(eventName, (ev) => {
      if (!bus.enable) {
        console.log('停止分发事件!');
        return;
      }

      if (eventName == 'click' && !!gis.hitTest) {
        view.hitTest(ev).then(function (response) {
          // view.popup.location = response.mapPoint

          // 点击到图形处理
          let resp = [];
          if (response.results.length > 0) {
            resp = response.results.map((x) => {
              return x.graphic;
            });
          }
          const r = resp[0];
          var layerName = r.layer.id;
          console.log(layerName + '|' + eventName);
          bus.emit(layerName + '|' + eventName, resp);
        });
      } else {
        // eventName == 'click' && console.log("click", ev)
        bus.emit(current + '-' + eventName, ev);
      }
    });
  }
  // 地图改变事件
  view.map.allLayers.on('change', (params) => {
    bus.emit('esri-change', params);
  });
};

/**
 * 注册图形编辑事件
 * @param {*} view
 * @param {*} bus
 */
const drawEmit = (view, bus) => ({ id, oid, type, title, content }) => {
  var draw = new modules.Draw({ view: view });

  const symbol =
    type == 'text'
      ? createSymbol(18, 'text', 'palegreen', title)
      : createSymbol(type);

  var shape = new Shape({
    id: oid,
    popup: { title, content },
    layer: graphicsLayer,
    text: '我走了',
    view,
    symbol,
    type,
    attributes: {},
  });

  var graphicsLayer =
    view.map.findLayerById(id) || new modules.GraphicsLayer({ id });
  graphicsLayer.add(shape.graphic);
  view.map.add(graphicsLayer);

  var action = draw.create(shape.drawType);

  //todo 停止分发地图事件
  bus.enable = false;

  action.on('vertex-add', function (evt) {
    shape.update(evt.vertices);
  });

  action.on('cursor-update', function (evt) {
    // point : { coordinates }
    shape.setMousePosition(evt.mapPoint || evt.coordinates);
  });

  action.on('draw-complete', function (evt) {
    bus.enable = true;

    // console.log("draw-complete", evt);
    if ('point,text'.indexOf(type) > -1) {
      shape.update(evt.coordinates);
    }
    shape.clearTemp();
    // 返回中心点
  });

  action.on('vertex-remove', function (evt) {
    //  measureLine(evt.vertices);
    bus.emit(evt.type, evt.vertices);
  });
};

export { drawEmit as initDrawEmit, esriEmit as initEsriEmit };

/**
 *
 *
coordinates


  // view.popup.open({
  //   title: props.title,
  //   visible: false,

  //   // spinnerEnabled: false,


  // });


  view.popup.watch("visible", function (response) {
    console.log("view.popup", response)

    // view.popup.visible = true;
  });

pointer-move
  {
  pointerId: Number,
  pointerType: "mouse","touch",
  x: Number,
  y: Number,
  button: Number,
  buttons: Number,
  type: "pointer-move",
  stopPropagation: Function,
  timestamp: Number,
  native: Object
  }





 */
