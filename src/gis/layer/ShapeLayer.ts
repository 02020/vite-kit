/** @format */

import { graphicsLayer, graphicsLayerControl } from '.';
import { highlight, popupHandle } from '../common';
import { goTo } from '../core';

export default class ShapeLayer {
  private layer: __esri.GraphicsLayer;

  private view: __esri.MapView;

  popupHandle: any;
  // 关闭事件
  private enable: boolean = false;
  private __highlight: any;

  layerControl: {
    add(geometry: any, attrs?: object, symbol?: __esri.Symbol): void;
    addMany(geoList: Array<any>, cb: any): void;
    delete(id: string): void;
    removeAll(): void;
  };
  lastFeatures: __esri.HitTestResultResults[] = [];

  constructor(
    private content: any,
    id?: string,
    private symbol?: __esri.Symbol
  ) {
    this.view = content.view;
    this.layer = graphicsLayer(this.view, id);

    this.layerControl = graphicsLayerControl(this.view, this.layer);
    this.popupHandle = popupHandle(this.view, this.layer);
    this.__highlight = highlight(this.view, this.layer);
    this.__highlight.enable(false);
  }

  /**
   * 增加图形到layer
   * @param geometry
   * @param attrs
   * @param symbol
   */
  add(geometry: any, attrs?: object, symbol?: __esri.Symbol) {
    symbol = symbol || this.symbol;
    return this.layerControl.add(geometry, attrs, symbol);
  }
  /**
   * 添加多个数据
   * @param geoList
   */
  addMany(geoList: any) {
    const cb = (geometry: any) => this.symbol;
    this.layerControl.addMany(geoList, cb);
    return this;
  }

  update() {}

  delete(id: string) {
    this.layerControl.delete(id);
    return this;
  }

  clear() {
    this.layerControl.removeAll();
    return this;
  }

  /**
   * 定位
   * @param args
   */
  goTo(...args) {
    args.unshift(this.layer);
    goTo(this.view, args);
    return this;
  }

  effect(fn: any) {
    this.popupHandle.effect(fn);
    return this;
  }
  /**
   *
   * 高亮
   * @memberof ShapeLayer
   */
  get highlight() {
    return this.__highlight.value();
  }

  /**
   *
   * 高亮
   * @memberof ShapeLayer
   */
  set highlight(value) {
    this.__highlight.enable(value);
    !value && this.__highlight.clear();
  }



  /**
   *
   * add addMany removeAll remove
   * @readonly
   * @memberof ShapeLayer
   * [方法](http://192.168.3.91/esri/v415_sdk/latest/api-reference/esri-core-Collection.html)
   */
  get graphics() {
    return this.layer.graphics;
  }
  //

  withClick(title: string, component: any):void;
  withClick(key: string, value: any, title?: string, component?: any):void;
  withClick(...args: [string, any, string?, any?]) {
    let key: string, value: any, title: any, component: any;
    if (args.length == 2) {
      key = '';
      value = '';
      title = args[0];
      component = args[1];
    } else {
      [key, value, title, component] = args;
    }

    this.popupHandle.withClick({ key, value, title, component });
    return this;
  }

  withMove(title: string, component: any);
  withMove(key: string, value: any, title: string, component: any);
  withMove(...args: [string, any, string?, any?]) {
    let key: string, value: any, title: string, component: any;
    if (args.length == 2) {
      key = '';
      value = '';
      title = args[0];
      component = args[1];
    } else {
      [key, value, title, component] = args;
    }

    this.popupHandle.withMove({ key, value, title, component });
    return this;
  }
}
