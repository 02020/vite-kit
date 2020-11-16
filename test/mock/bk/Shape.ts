/**
 * @format
 * @module event-bus/graphic
 */
import { modules } from "../core";
import { ShapeStrategy } from "./Strategy";
import { createSymbol } from "./symbols";

/**
 * 支持:点 线 面
 */
export default class Shape {
  /** 图形位置 */
  public graphic: __esri.Graphic;

  /** esri-view */
  private view: __esri.MapView;

  /** 当前图形类型 */
  private shapeType: string;

  public drawType?: "circle" | "polyline" | "point" | "multipoint" | "polygon" | "rectangle" | "ellipse";
  /**
   *
   * 弹窗组件
   * @private
   * @type {{}}
   * @memberof Shape
   */
  private popup: {};

  /**
   *
   * 图形附属文字
   * @private
   * @type {Graphic}
   * @memberof Shape
   */
  private labelGraphic: __esri.Graphic;

  /**
   * 临时图层 ( 存放 mousePoint, mouseLine)
   * @private
   * @type {GraphicsLayer}
   * @memberof Shape
   */
  private layer: __esri.GraphicsLayer;
  /**
   *  当前鼠标点  (实时更新)
   * @private
   * @type {Graphic}
   * @memberof Shape
   */
  private mousePoint: __esri.Graphic;

  /**
   * 当前鼠标与上一点连线 (实时更新)
   * @private
   * @type {Graphic}
   * @memberof Shape
   */
  private mouseLine: __esri.Graphic;
  lastPoint: any;

  /** 绘制坐标 */
  private shapeStrategy: ShapeStrategy;

  constructor(options) {
    const { view, vertices, type, symbol, text, popup, attributes,id } = options;
    this.view = view;

    this.shapeType = type;
    this.drawType = type == "text" ? "point" : type;

   ShapeStrategy.view =view;

    this.graphic = new modules.Graphic({
  
      // geometry: this.shapeStrategy[this.shapeType](vertices),
      symbol,
      attributes,
    });

    this.popup = popup;

    // 报错 暂时注释
    // this.graphic.$shape = this;

    // 增加临时数据
    var graphicsLayer = new modules.GraphicsLayer();
    view.map.add(graphicsLayer);
    this.layer = graphicsLayer;
    this.createGraphic(text);
    this.layer.addMany([this.mouseLine, this.mousePoint, this.labelGraphic]);
  }

  /**
   * 更新当前鼠标位置
   * @param point
   */
  setMousePosition(point: Array<number> | any) {
    // 鼠标点位置
    this.mousePoint.geometry = ShapeStrategy.point(point);

    // 增加当前鼠标点与上一点的连线
    if (!!this.lastPoint) {
      this.mouseLine.geometry = ShapeStrategy.polyline([
        this.lastPoint,
        point,
      ]);
    }
  }
  getCenter() {
    return this.graphic.geometry.extent.center;
    //  return this.shapeStrategy.polygon(vertices).centroid;
  }
  /** 清空临时数据 */
  clearTemp() {
    this.view.map.remove(this.layer);
  }

  /**
   *
   * 设置 Shape 样式
   * @param {*} symbol
   * @returns {Graphic}
   * @memberof Shape
   */
  setLabelSymbol(symbol): __esri.Graphic {
    this.graphic.symbol = symbol;
    return this.graphic;
  }
  /**
   *
   *
   * @private
   * @param {string} text
   * @memberof Shape
   */
  private async createGraphic(text: string) {
    // #40d47e

    let marker = createSymbol(8, "diamond", "palegreen", "seagreen");

    this.mousePoint = new modules.Graphic({ symbol: marker });

    this.mouseLine = new modules.Graphic({
    //  symbol: createSymbol(4, [0, 197, 255, 1]),
    });

    let label = createSymbol(18, "text", "palegreen", text);

    this.labelGraphic = new modules.Graphic({
      symbol: label,
      visible: !!text,
    });
  }
  /**
   * 文字标签
   * @point {}
   *
   */
  setLabel(vertices, text: string): __esri.Graphic {
    this.labelGraphic.geometry = ShapeStrategy.point(vertices);
    this.labelGraphic.symbol.set("text", text);
    return this.labelGraphic;
  }

  /**
   * pointer-move
   * @param {object} 点A
   */

  update(vertices: any) {
    
    if (this.drawType == "point") {
      this.graphic.geometry = ShapeStrategy.point(vertices);
      return;
    }

    this.lastPoint = vertices[vertices.length - 1];

    this.graphic.geometry = ShapeStrategy[this.shapeType](vertices);

    let geo = this.graphic.geometry;

    let center = this.shapeType == "point" ? vertices : geo.extent.center;

    this.labelGraphic.geometry = ShapeStrategy.point(center);

    console.log("update", this.graphic);
  }
  /**
   * 更新属性
   * @param attrs
   */
  attrs(attrs) {
    console.log("shape-attrs", attrs);
    Object.keys(attrs).forEach((key) => {
      this.graphic.attributes[key] = attrs[key];
    });

    return this;
  }
  /**
   * 更新样式
   */
  style(symbols) {
    console.log("更新样式", this.graphic, symbols);
    return this;
  }

  remove() {}
}

 

/*
// todo  Polygon -方法
addRing()	Polygon	Adds a ring to the Polygon.more details	Polygon
clone()	Polygon	Creates a deep clone of Polygon object.more details	Polygon
contains()	Boolean	Checks on the client if the input point is inside the polygon.more details	Polygon
fromExtent()	Polygon	Converts the given Extent to a Polygon instance.more details	Polygon
fromJSON()	
getPoint()	Point	Returns a point specified by a ring and point in the path.more details	Polygon
insertPoint()	Polygon	Inserts a new point into the polygon.more details	Polygon
isClockwise()	Boolean	Checks if a Polygon ring is clockwise.more details	Polygon
removePoint()	Point[]	Removes a point from the polygon at the given pointIndex
removeRing()	Point[]	Removes a ring from the Polygon.more details	Polygon
setPoint()	Polygon	Updates a point in the polygon.more details	Polygon
toJSON()

只有 centroid
isSelfIntersecting: 判断是否是自相交 

// todo Polygon - Property - 属性
cache	Object	The cache is used to store values computed from geometries that need to cleared or recomputed upon mutation.more details	Geometry
centroid	Point	The centroid of the polygon.more details	Polygon
declaredClass	String	The name of the class.more details	Accessor
extent	Extent	The extent of the geometry.more details	Geometry
hasM	Boolean	Indicates if the geometry has M values.more details	Geometry
hasZ	Boolean	Indicates if the geometry has z-values (elevation).more details	Geometry
isSelfIntersecting	Boolean	Checks to see if polygon rings cross each other and indicates if the polygon is self-intersecting, which means the ring of the polygon crosses itself.more details	Polygon
rings	Number[][][]	An array of rings.more details	Polygon
spatialReference	SpatialReference	The spatial reference of the geometry.more details	Geometry
type	String	The string value representing the type of geometry.more details	Polygon

*/

/*
// todo  Polyline
addPath()	Polyline	Adds a path, or line segment, to the polyline.more details	Polyline
clone()	Polyline	Creates a deep clone of Polyline object.more details	Polyline
fromJSON()
getPoint()	Point	Returns a point specified by a path and point in the path.more details	Polyline
insertPoint()	Polyline	Inserts a new point into a polyline.more details	Polyline
removePath()	Point[]	Removes a path from the Polyline.more details	Polyline
removePoint()	Point	Removes a point from the polyline at the given pointIndex 
setPoint()	Polyline	Updates a point in a polyline.more details	Polyline
toJSON()	
*/
