/** @format */

import { modules, goTo, emitter } from '../core';
import { ShapeTypeIndex } from './';
import { createSymbol, symbolStrategy } from './symbols';
import { camelize, capitalize, invokeFns, isNil } from '../../shared';
import { graphicsLayer } from '../layer';
import { onEventHandler } from '.';

const pointToArray = (point: Array<number> | ICoordinates) => {
  return Array.isArray(point) ? point : [point.x, point.y];
};

export const shapeStrategy = (_view: __esri.MapView) => {
  const view = _view;

  return {
    /**
     * 点
     * @param point
     */
    point(point: Array<number> | ICoordinates) {
      if (!point) {
        console.log('ShapeStrategy-入参为空');
        return null;
      }
      const _point = pointToArray(point);
      return new modules.Point({
        longitude: _point[0],
        latitude: _point[1],
        spatialReference: view.spatialReference,
      });
    },
    /**
     * 文字
     * @param point
     */
    text(point) {
      return this.point(point);
    },
    /**
     * 线
     * @param vertices
     */
    polyline(vertices) {
      if (!vertices || !Array.isArray(vertices)) {
        return null;
      }
      return new modules.Polyline({
        paths: [vertices.map(pointToArray)],
        spatialReference: view.spatialReference,
      });
    },
    /**
     * 文字
     * @param vertices
     */
    polygon(vertices) {
      if (!vertices || !Array.isArray(vertices)) {
        return null;
      }
      return new modules.Polygon({
        rings: [vertices.map(pointToArray)],
        spatialReference: view.spatialReference,
      });
    },
  };
};

export const createGraphic = (view, geometry, attributes?, symbol?) => {
  let graphic: __esri.Graphic = null;

  if ('screenPoint' in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry: view.toMap(geometry.screenPoint),
    });
  } else if ('x' in geometry && 'y' in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry: geometry,
    });
  } else if ('lng' in geometry && 'lat' in geometry) {
    graphic = modules.Graphic.fromJSON({
      geometry: { x: parseFloat(geometry.lng), y: parseFloat(geometry.lat) },
    });
  } else if ('attributes' in geometry && 'geometry' in geometry) {
    // 标绘
    graphic = modules.Graphic.fromJSON(geometry);
  } else {
    graphic = modules.Graphic.fromJSON({ geometry });
  }

  attributes && (graphic.attributes = attributes);

  if (!isNil(symbol)) {
    graphic.symbol = !symbol
      ? createSymbol(isShapeType(graphic.geometry))
      : symbol;
  }

  if (!graphic.geometry) {
    console.error(geometry);
    throw new Error(`图形创建失败`);
  }

  graphic.geometry.spatialReference = view.spatialReference;
  return graphic;
};

export const isShapeType = (geometry: IGeometry) => {
  if ('rings' in geometry) {
    return ShapeTypeIndex.Polygon;
  } else if ('paths' in geometry) {
    return ShapeTypeIndex.Polyline;
  } else if ('points' in geometry) {
    return ShapeTypeIndex.Point;
  } else if ('x' in geometry && 'y' in geometry) {
    return ShapeTypeIndex.Point;
  } else {
    console.error('type error');
  }
};

export function GIS(_: __esri.MapView) {
  const view = _;

  view.popup.watch('visible', (newValue, oldValue, propertyName, target) => {
    let params = {};
    params[propertyName] = newValue;
    emitter.emit('popup', params);
  });

  class Shape {
    graphic: __esri.Graphic;
    symbol: any;
    layer: __esri.GraphicsLayer;
    lastGraphic: __esri.Graphic;
    onEvent = onEventHandler(view);
    sketchVM: __esri.SketchViewModel;
    handle: IHandle;
    effectSet: Set<() => void>;

    constructor(id: string, priority: number) {
      if (!!id) {
        this.layer = graphicsLayer(view, id, priority);
      }
    }

    /**
     * 增加图形，若存在则修改
     * @param geometry
     */
    withPoint(geometry) {
      if (!geometry) {
        console.error('geometry 不能为空');
        return;
      }
      if (this.graphic) {
        this.update(geometry);
      } else {
        this.graphic = createGraphic(view, geometry);
      }

      return this;
    }

    /**
     * 增加标题
     * @param title
     */
    withTitle(title: string | Function) {
      if (!this.graphic) {
        throw new Error('请先执行withPoint');
      }
      this.graphic.popupTemplate = new modules.PopupTemplate({ title });
      return this;
    }

    /**
     * 增加属性
     * @param title
     */
    withAttrs(attrs:any) {
      this.graphic.attributes = attrs;
      return this;
    }

    /**
     * 增加样式
     * @param args
     */
    withSymbol(...args: [string | number, string, string, string]) {
      const name = args[0] as string;
      if ('default,pickup'.indexOf(name) > -1) {
        this.symbol = symbolStrategy(name)[isShapeType(this.graphic.geometry)];
      } else {
        this.symbol = createSymbol.apply(this, args);
      }

      if (this.graphic) {
        this.graphic.symbol = this.symbol;
      }
      return this;
    }

    /**
     * 增加弹窗
     * @param title 弹窗标题
     * @param component 弹窗组件\dom
     */
    withPopup(title, component) {
      this.graphic.popupTemplate = new modules.PopupTemplate({
        title: title,
        outFields: ['*'],
      });

      if (component) {
        this.graphic.popupTemplate.content = component.$el || component;
      }

      return this;
    }

    /**
     * 打开弹窗
     */
    open() {
      setTimeout(() => {
        view.popup.open({
          features: [this.graphic],
          location: this.center(),
        });
      }, 500);
      return this;
    }

    /**
     * 增加图形到地图
     */
    build() {
      if (this.symbol) this.graphic.symbol = this.symbol;
      this.symbol = this.graphic.symbol;
      // console.log(this.layer);
      !this.layer
        ? view.graphics.add(this.graphic)
        : this.layer.add(this.graphic);
      return this;
    }

    update(geometry) {
      this.graphic.geometry = createGraphic(
        view,
        geometry,
        null,
        null
      ).geometry;

      if (view.popup.visible) {
        view.popup.location = this.center();
      }

      return this;
    }

    /**
     * 返回图形中心点
     */
    center() {
      let geometry = this.graphic.geometry;
      return geometry.extent
        ? geometry.extent.center
        : (geometry as __esri.Point);
    }

    /**
     * 移除图形
     */
    remove() {
      !this.layer
        ? view.graphics.remove(this.graphic)
        : this.layer.remove(this.graphic);

      return this;
    }
    /**
     * 移除图层的图形
     */
    removeAll() {
      !this.layer ? view.graphics.removeAll() : this.layer.removeAll();
      return this;
    }
    /**
     * 自定义事件，接入回调
     * @param name
     * @param cb
     */
    withEvent(name, cb) {
      this.onEvent['on' + capitalize(camelize(name))](this.graphic, cb);
      return this;
    }

    withClose(cb) {
      emitter.on('popup', (param) => {
       if(!param.visible){
         cb && cb(this)
       };
      });

      return this;
    }

    /**
     * 当鼠标从图形上移开，则删除当前图形
     */
    withLeaveRemove() {
      this.onEvent.onMouseLeave(this.graphic, (g) => {
        const layer = g.layer as __esri.GraphicsLayer;
        layer.remove(g);
        view.popup.close();
        this.onEvent.remove('pointer-move');
      });
      return this;
    }

    /**
     * 开启图形编辑
     * @param activeTool
     */
    withSketch(activeTool: 'reshape' | 'transform' | 'move' = 'reshape') {
      if (!this.layer) {
        console.error('图层不存在，请在构建的时候传入图层id');
        return;
      }

      if (!this.sketchVM && !this.layer['sketchVM']) {
        this.sketchVM = new modules.SketchViewModel({
          view: view,
          layer: this.layer,
        });
        this.layer['sketchVM'] = this.sketchVM;

        this.onEvent.onMove(null, (graphics) => {
          this.sketchVM.state != 'active' &&
            this.sketchVM.update(graphics, {
              tool: activeTool,
            });
        });

        this.sketchVM.on('update', (event) => {
          invokeFns(this.effectSet, {
            geometry: event.graphics[0].geometry,
            type: event.type,
            event,
          });
          event.graphics.forEach((x) => {
            this.symbol && (x.symbol = this.symbol);
          });
        });
      } else {
        this.sketchVM = this.layer['sketchVM'];
      }
      view.popup.close();
      this.sketchVM.update(this.layer.graphics.toArray(), { tool: activeTool });
      //this.handle && this.handle.remove();

      return this;
    }

    effect(fn) {
      if (!this.effectSet) {
        this.effectSet = new Set();
      }
      this.effectSet.add(fn);
    }
    /**
     * 定位
     * @param args
     */
    goTo(...args) {
      args.unshift(this.graphic);
      goTo(view, args);
      return this;
    }
  }

  return {
    Shape,
  };
}

/*
const x = (e) =>
  'rings' in e
    ? R.Polygon
    : 'paths' in e
    ? R.Polyline
    : 'x' in e && 'y' in e
    ? R.Point
    : void console.error('type error');

  static init(view) {
    view.graphics.on('before-remove', (event) => {
      console.log(event);
      // event.preventDefault();  阻止移除
    });
    view.graphics.on('before-add', (event) => {
      console.log(event);
    });
  }

*/
