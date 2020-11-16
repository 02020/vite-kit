/** @format */

import { isInteger } from '../../shared';

/**
 *  MapView 事件
 *
 * @format
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
  'pointer-down',
  'pointer-enter', // 进入dom
  'pointer-leave', // 离开dom
  'layerview-destroy',
  'layerview-create',
  'layerview-create-error',
];

export const viewEvents = (content) => {
  const view = content.view as __esri.MapView;

  for (var i = 0; i < MAP_VIEW_EVENTS.length; i++) {
    const eventName = MAP_VIEW_EVENTS[i];
    view.on(eventName, (ev) => {
      if (eventName == 'pointer-move') {
        ev.__point = view.toMap(ev);
      }

      if (eventName.indexOf('layerview') > -1) {
        let __name = 'gis' + eventName.replace('layerview', '');
        __name += '-' + ev.layer.id || 'none';
        // console.log(__name, ev);
        content.emit(__name, ev.layer);
        return;
      }

      if (content.hitTest) {
        // console.log(ev)
        view.hitTest(ev).then((response) => {
          let resp = [],
            name = 'gis-' + eventName;

          if (response.results.length > 0) {
            resp = response.results.map((x) => {
              return x.graphic;
            });

            var layerId = resp[0].layer.id || 'default';
            content.emit(name + '-' + layerId, response);
          }

          content.emit(name, response);
        });
      } else {
        // eventName == 'click' && console.log("click", ev)
        content.emit('gis-' + eventName, ev);
      }

      if ('pointer-down' == eventName) {
        if (ev.button === 2) {
        }
        // 鼠标左键
        else if (ev.button === 0) {
        }
      }
    });
  }
  // 地图改变事件
  view.map.allLayers.on('change', (params) => {
    content.emit('gis-change', params);
  });

  view.watch('scale', (ev) => {
    const { xmax, xmin, ymax, ymin } = view.extent;
    isInteger(view.zoom) &&
      content.emit('gis-zoom', {
        scale: view.scale,
        zoom: view.zoom,
        center: center(view.extent),
        xmax,
        xmin,
        ymax,
        ymin,
        extent: view.extent,
        view: view,
      });
  });

  view.popup.watch('visible', (newValue, oldValue, propertyName, target) => {
    // console.log(
    //   propertyName + ' changed from ' + oldValue + ' to ' + newValue
    // )
    let params = {};
    params[propertyName] = newValue;
    content.emit('gis-popup', params);
  });
  // 结束
};

// 根据当前四至绘制矩形框
const center = (extent) => {
  const { xmax, xmin, ymax, ymin } = extent;
  return {
    x: (xmax + xmin) / 2,
    y: (ymax + ymin) / 2,
  };
};

/*


    this.view.whenLayerView(layer)
    .then(function(layerView) {
      console.log(layerView)
    
    })
    .catch(function(error) {
    
    });

    this.view.when(()=>{

      console.log("when")
    })
    

*/
