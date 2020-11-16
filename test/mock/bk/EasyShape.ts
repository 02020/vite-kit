/** @format */

import { modules } from '../core';
import { ShapeStrategy } from './Strategy';
import { createSymbol } from './symbols';

/**
 * 最小单元, 其他类可的继承, 增加其他属性
 */
class Vertices {
  oid: string;
  title: string;
  vertices: Array<number>;
  symbol?: any;
  attributes?: object;
}

export default class EasyShape {
  /**
   *
   * 需要添加的图形
   * @private
   * @type {Array<__esri.Graphic>}
   * @memberof EasyShape
   */
  private graphics: Array<__esri.Graphic> = [];

  /**
   *
   * 当前图形类型
   * @private
   * @type {string}
   * @memberof EasyShape
   */
  private shapeType: string;

  /**
   *
   * 图层ID
   * @type {string}
   * @memberof EasyShape
   */
  layerId: string;
  /**
   *
   * 图形ID
   * @type {*}
   * @memberof EasyShape
   */
  oid: any;

  /**
   *
   * 默认样式
   * @type {__esri.symbolsSymbol}
   * @memberof EasyShape
   */
  private __symbol: __esri.symbolsSymbol;

  /**
   *
   * 图形属性
   * @type {*}
   * @memberof EasyShape
   */
  attributes: any;

  /**
   *
   * 地图
   * @view {*}
   * @memberof EasyShape
   */
  view: __esri.MapView;

  /**
   *
   * @param id 图层ID
   * @param type 图形类型
   * @param view 地图
   */
  constructor(id, type, view) {
    // const { id, oid, type, symbol } = options;
    this.view = view;
    this.layerId = id;
    // this.oid = oid;
    this.__symbol = createSymbol(type);

    this.shapeType = type;
    // this.popup = popup;
  }

  symbol(...args) {
    this.__symbol = createSymbol.apply(args);
    return this;
  }

  /**
   * 图形坐标点
   * @param points
   */
  vertices(points: Array<number>);
  /**
   * 图形属性
   * @param vertices
   */
  vertices(vertices: Vertices);

  vertices(...args) {
    let __v: Vertices = new Vertices();
    const x = args[0];

    if (Array.isArray(x)) {
      // 只有一个入参
      __v.vertices = x;
    } else if (typeof args[0] === 'string' && typeof args[1].length === 'number') {
      // 两个入参
      const [title, vertices] = args;
      // this.symbol.text = title;
      console.log(this.symbol);
      __v.title = title;
      __v.vertices = vertices;

      if (typeof args[2] == 'object') {
        // 三个入参
        __v.attributes = args[2];
      }
    } else if (typeof x == 'object') {
      //对象
      __v = <Vertices>args[0];
    }
    __v.attributes = __v.attributes || {};
    // __v.attributes.__oid = '' + new Date();

    var graphic = new modules.Graphic({
      attributes: __v.attributes,
      geometry: ShapeStrategy[this.shapeType](__v.vertices),
      symbol: this.symbol,
    });

    this.graphics.push(graphic);
    return this;
  }

  fromJSON(json: string) {
    
    let graphic = modules.Graphic.fromJSON(json);

    if (!graphic.geometry) {
      console.log('坐标数据不存在');
      return;
    }

    // graphic.symbol = createSymbol(this.shapeType);

    this.graphics.push(graphic);
  }

  /**
   * 增加到指定图层
   * @param layerId
   */
  add(layerId?:string) {
    layerId = layerId || this.layerId;
    const layer = modules.view.map.findLayerById(layerId) as __esri.GraphicsLayer;
    if (!layer) {
      console.log(`${this.layerId} 图层不存在`);
      return;
    }

    layer.addMany(this.graphics);
    // this.graphics.length = 0;
  }

  // get oids() {
  //   return this.graphics.map((x) => x.attributes.__oid);
  // }

  // set vertices(value) {
  //   this.vertices = value;
  // }
}

/**  
  : InstanceType<typeof EasyShape> 
  
  
  */
// new EasyShape({}).vertices([1,22]).
