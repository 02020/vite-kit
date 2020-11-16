/** @format */
import GIS from '../app/app';
import { WidgetsIndex } from '../shared';
declare global {
  interface Window {
    gis: InstanceType<typeof GIS>;
    $bus: any;
  }

  type IGIS = InstanceType<typeof GIS>;

  interface ShapeStrategy {
    point(point: number[] | ICoordinates): __esri.Point;
    text(point: any): any;
    polyline(vertices: any): __esri.Polyline;
    polygon(vertices: any): __esri.Polygon;
  }

  type IGeometry = IRings | IPaths | ICoordinates | __esri.Geometry;

  type IRings = {
    [key in 'rings']: Array<Array<Array<number>>>;
  };

  type IPaths = {
    [key in 'paths']: Array<Array<Array<number>>>;
  };

  interface IHandle {
    remove(): void;
  }

  interface PopupHandle {
    [x: string]: any;
    withHandle(name: 'move' | 'click' | 'pointer-move', component: any): void;
    clear(name?: string): void;
    enable(flag: boolean): void;
    effect(): void;
  }
  /**
   *  我是标题
   *
   * Value | Description
   * ------|-------------
   * solid | ![sls-solid](https://www.baidu.com/img/flexible/logo/pc/result.png)
   * solid | 陈
   *
   * > **支持MD** 高亮 [我是连接](https://www.baidu.com).
   *
   * [Read more...](https://www.yuque.com/ever2/fr/co86lu)
   *
   * @default solid
   */
  type ICoordinates = {
    x: number;
    y: number;
  };

  interface SketchViewModelProperties {
    id?: string;
    view?: __esri.MapViewProperties | __esri.SceneViewProperties;
    layer?: __esri.GraphicsLayerProperties;
    point?:
      | __esri.SimpleMarkerSymbolProperties
      | __esri.PointSymbol3DProperties;
    polygon?:
      | __esri.SimpleFillSymbolProperties
      | __esri.PolygonSymbol3DProperties;
    polyline?:
      | __esri.SimpleLineSymbolProperties
      | __esri.LineSymbol3DProperties;
    keyField: string;
    /**
     *
     */
    edit?: SketchViewModeEdit;
    /**
     * 启用点击后编辑图形，默认不启用
     * @default false
     */
    updateOnGraphicClick?: boolean;
  }

  interface SketchViewModeEdit {
    point?:
      | __esri.SimpleMarkerSymbolProperties
      | __esri.PointSymbol3DProperties;
    polygon?:
      | __esri.SimpleFillSymbolProperties
      | __esri.PolygonSymbol3DProperties;
    polyline?:
      | __esri.SimpleLineSymbolProperties
      | __esri.LineSymbol3DProperties;

    /**
     * 点击后关闭当前编辑的图形:默认开启
     * @default true
     */
    immediate: boolean;
  }

  type Widgets = {
    [key in WidgetsIndex]?: any;
  };

  interface MapView {
    extent: any;
    zoom: number;
    center: string;
    wkid: number;
    country: any;
    layerList?: any;
    container?: HTMLDivElement;
    wkt?:string,
    tileInfo: boolean | object
    widgets: Widgets;
  }

  interface ISketch {}

  interface IPrintParameters {
    layout: string;
    format: 'pdf' | 'png32' | 'png8' | 'jpg' | 'gif' | 'eps' | 'svg' | 'svgz';
    dpi: number;
    titleText: string;
    authorText: string;
    customTextElements: any;
  }

  class Vertices {
    oid: string;
    title: string;
    vertices: Array<number>;
    symbol?: any;
    attributes?: object;
  }

  type Test = keyof typeof WidgetsIndex;
  let t: Test;
}

declare global {
  namespace __GIS {
    type IApp = InstanceType<typeof GIS>;
    // 定义基本使用的类型
    type Selector = string;
  }
}

// 注意: 修改"全局声明"必须在模块内部, 所以至少要有 export{}字样
// 不然会报错❌: 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中
export {};

type TypeOrArray<T> = T | T[];
// 定义 jQuery 接口，jquery 是一个 包含 Element 的集合
interface JQuery<TElement extends Node = HTMLElement>
  extends Iterable<TElement> {
  length: number;
  eq(index: number): this;

  // 重载
  add(context: Element): this;
  add(selector: string | TypeOrArray<Element> | JQuery): this;

  children(selector?: string): this;
  css(propertyName: string): string;
  html(): string;
}

// // 对模块 jquery 输出接口
// declare module 'jquery' {
//   // module 中要使用 export = 而不是 export default
//   export = jQuery;
// }
