/** @format */

// http://g.com/esri/v415_sdk/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#activeTool

import { modules } from '../core';

import { isObject, isNil, isNotEnumThrow } from '../../shared';
import { graphicsLayer, graphicsLayerControl } from '.';
import {
  isShapeType,
  popupHandle,
  createSymbol,
  SketchTypeIndex,
  SketchCreateTool,
  ActiveToolIndex,
} from '../common';

export default class SketchVM {
  public sketchVM: any; // __esri.SketchViewModel;
  private layer: __esri.GraphicsLayer;
  private enable: boolean = true;
  /**
   *
   * 当前绘制完成后的图形、激活的图形的Geometry
   * @type {__esri.Geometry}
   * @memberof SketchVM
   */
  public sketchGeometry: any; // : __esri.Geometry;

  layerControl: {
    add(geometry: IGeometry, attrs?: object, symbol?: __esri.Symbol): void;
    addMany(geoList: Array<any>, cb: any): void;
  };
  paramEdit: any; // SketchViewModeEdit;
  activeSymbols: any;
  popupHandle: any; //  PopupHandle;
  activeMark: any; // string;
  activeShapeType: any; // SketchTypeIndex;
  lastUpdateGraphic: any; // __esri.Graphic;
  keyField: string = '';

  constructor(
    private view: __esri.MapView,
    param?: any // string | SketchViewModelProperties
  ) {
    let properties: __esri.SketchViewModelProperties = {
      view,
      defaultUpdateOptions: {
        tool: 'reshape',
        enableRotation: false,
        enableScaling: false,
        enableZ: false,
        toggleToolOnClick: false,
      },
      updateOnGraphicClick: false,
      defaultCreateOptions: { hasZ: false },
    };

    if (!!param && isObject(param)) {
      this.layer = graphicsLayer(view, param.id);

      param.point && (properties.pointSymbol = param.point);
      param.polygon && (properties.polygonSymbol = param.polygon);
      param.polyline && (properties.polylineSymbol = param.polyline);

      !isNil(param.updateOnGraphicClick) &&
        (properties.updateOnGraphicClick = param.updateOnGraphicClick);

      this.paramEdit = param.edit;
    } else {
      this.layer = graphicsLayer(view, param as string);
    }
    properties.layer = this.layer;

    this.sketchVM = new modules.SketchViewModel(properties);

    param && param.text && (this.sketchVM['textSymbol'] = param.text);

    if (this.sketchVM.layer.id == '__draw') {
      this.enable = false;
    }

    this.layerControl = graphicsLayerControl(view, this.layer);
    this.popupHandle = popupHandle(view, this.layer);
    this.init();
  }

  withClick(key: string, title: string, component: any) {
    this.popupHandle.withClick({ key, title, component });
    return this;
  }

  withMove(key: string, title: string, component: any) {
    this.popupHandle.withMove({ key, title, component });
    return this;
  }

  remove() {
    this.popupHandle.clear();
  }

  get popup() {
    return this.view.popup;
  }

  private init() {
    this.sketchVM.on('create', (event) => {
      this.popupHandle.enable(false);

      if (event.state === 'complete') {
        this.popupHandle.enable(true);

        event.graphic.setAttribute('__mark', this.activeMark || event.tool);

        if (this.activeShapeType == 'text') {
          event.graphic.symbol = this.sketchVM['textSymbol'];
        }

        this.sketchVM.emit('complete', {
          graphic: event.graphic,
          geometry: event.graphic.geometry,
          type: this.activeShapeType,
          event,
        });

        this.lastUpdateGraphic = event.graphic;
        !this.enable && this.layer.remove(event.graphic);
      }

      const eventInfo = event.toolEventInfo;
      if (eventInfo && eventInfo.type === 'cursor-update') {
        //  console.log(eventInfo.type, eventInfo.coordinates[0], eventInfo.coordinates[1]);
      }
    });

    this.sketchVM.on('update', (event) => {
      if (event.state === 'active') {
      }

      event.graphics.forEach((x) => {
        //let type = isShapeType(x.geometry as any);
        let type = x.getAttribute('__mark');

        let typeSymbol = 'circle,rectangle'.includes(type) ? 'polygon' : type;

        x.symbol =
          (this.paramEdit && this.paramEdit[typeSymbol]) ||
          this.sketchVM[typeSymbol + 'Symbol'];
      });

      if (event.state === 'complete') {
        let type = event.graphics[0].getAttribute('__mark');

        this.sketchVM.emit('complete', {
          graphic: event.graphics[0],
          geometry: event.graphics[0].geometry,
          type: type,
          event,
        });

        this.lastUpdateGraphic = event.graphics[0];

        // event.graphics.forEach((x, i) => {
        //  let symbol = this.activeSymbols[i]
        //  console.log(symbol)
        //   x.symbol = symbol;
        // });
      }
    });

    // this.sketchVM.on('delete', function (event) {
    //   event.graphics.forEach(function (graphic) {
    //     console.log('deleted', graphic);
    //   });
    // });
  }
  effect(fn) {
    this.popupHandle.effect(fn);
    return this;
  }
  complete(fn: any) {
    this.sketchVM.on('complete', (param) => {
      fn(param);
    });
    return this;
  }
  /**
   * 增加图形
   * @param geometry
   * @param attrs
   * @param symbol
   */
  add(geometry: IGeometry, attrs?: object, symbol?: __esri.Symbol) {
    symbol = symbol || this.sketchVM[isShapeType(geometry) + 'Symbol'];
    this.layerControl.add(geometry, attrs, symbol);
    return this;
  }
  addMany(geoList) {
    const cb = (geometry) => this.sketchVM[isShapeType(geometry) + 'Symbol'];
    this.layerControl.addMany(geoList, cb);
    return this;
  }
  /**
   * 修改样式
   * @param args
   */
  update(...args) {
    let graphic = args.shift();
    graphic.symbol = createSymbol.apply(this, args);
  }

  /**
   * 绘制图形类型
   * @param geometryType
   */
  create(geometryType: SketchTypeIndex, mark?: string) {
    this.view.popup.visible = false;
    isNotEnumThrow(SketchTypeIndex, geometryType);
    this.activeShapeType = geometryType;
    this.activeMark = mark || geometryType;
    let tool: SketchCreateTool =
      geometryType == 'text' ? 'point' : geometryType;

    this.sketchVM.create(tool); // { mode: 'freehand' }
    return this;
  }

  get graphics() {
    return this.layer.graphics;
  }

  clear() {
    this.layer.removeAll();
  }
  /**
   * 删除选中的图形（如果只存在一个则不要选中）
   */
  delete() {
    // console.log(this.layer.graphics);
    if (this.layer.graphics.length == 1) {
      this.layer.removeAll();
    } else {
      this.sketchVM.delete();
    }
  }
  redo() {
    this.sketchVM.redo();
  }
  undo() {
    this.sketchVM.undo();
  }
  /**
   * 结束编辑或创建状态
   */
  cancel() {
    this.sketchVM.cancel();
  }
  destroy() {
    this.sketchVM.destroy();
  }

  /**
   *
   */
  active(value) {
    this.sketchVM.updateOnGraphicClick = value;
    return this;
  }

  updateList() {
    let updates = [];

    let graphics = this.sketchVM.updateGraphics;

    graphics = graphics.length == 0 ? this.layer.graphics : graphics;

    if (graphics.length === 0) {
      // console.error("未选中任何图形")
      return;
    } else if (graphics.length == 1) {
      updates = graphics.toArray();
    }
    return updates;
  }

  /**
   * 激活编辑工具
   * @param activeTool 激活的工具类型  'move', 'transform', 'reshape'
   * @param graphics 需要编辑的图形
   */
  activeTool(activeTool?: ActiveToolIndex, graphics?: Array<any>) {
    isNotEnumThrow(ActiveToolIndex, activeTool);

    if (!!graphics && graphics.length) {
      this.activeSymbols = graphics.map((x) => x.symbol);
    }

    if (this.layer.graphics.length == 1) {
      graphics = this.layer.graphics.toArray();
    }

    this.sketchVM.updateOnGraphicClick = true;
    this.sketchVM.update(graphics, {
      tool: activeTool || 'reshape',
      enableRotation: true,
      enableScaling: true,
      preserveAspectRatio: true,
      toggleToolOnClick: true,
    });
  }

  // todo
  goTo() {}
}
