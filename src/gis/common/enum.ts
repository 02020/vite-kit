/** @format */

export enum WidgetsIndex {
  Zoom = 'Zoom',
  Locate = 'Locate',
  NavigationToggle = 'NavigationToggle',
  Compass = 'Compass',
  Measurement = 'Measurement',
  Swipe = 'Swipe',
  TimeSlider = 'TimeSlider',
  ScaleBar = 'ScaleBar',
}

export enum ShapeTypeIndex {
  Point = 'point',
  Polyline = 'polyline',
  Polygon = 'polygon',
}

export type SketchCreateTool =
  | 'point'
  | 'multipoint'
  | 'polyline'
  | 'polygon'
  | 'rectangle'
  | 'circle';

export enum SketchTypeIndex {
  Point = 'point',
  Multipoint = 'multipoint',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Circle = 'circle',
  Rectangle = 'rectangle',
  Text = 'text',
}

export enum ActiveToolIndex {
  Move = 'move',
  Transform = 'transform',
  Reshape = 'reshape',
}

export enum ShapeLayerIndex {}

export enum PolygonStyle {
  NONE = 'none',
  SOLID = 'solid',
  BACKWARD_DIAGONAL = 'backward-diagonal',
  CROSS_CROSS = 'cross-cross',
  DIAGONAL_CROSS = 'diagonal-cross',
  FORWARD_DIAGONAL = 'forward-diagonal',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum PolylineStyle {
  DASH = 'dash',
  DASH_DOT = 'dash-dot',
  DOT = 'dot',
  LONG_DASH = 'long-dash',
  LONG_DASH_DOT = 'long-dash-dot',
  LONG_DASH_DOT_DOT = 'long-dash-dot-dot',
  NONE = 'none',
  SHORT_DASH = 'short-dash',
  SHORT_DASH_DOT = 'short-dash-dot',
  SHORT_DASH_DOT_DOT = 'short-dash-dot-dot',
  SHORT_DOT = 'short-dot',
  SOLID = 'solid',
}

export enum PointStyle {
  CIRCLE = 'circle',
  CROSS = 'cross-cross', //修正过
  DIAMOND = 'diamond',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  X = 'x',
}

export const Index = {
  ShapeTypeIndex,
  SketchTypeIndex,
  ActiveToolIndex,
  WidgetsIndex,
  PolygonStyle,
  PolylineStyle,
  PointStyle,
};
