/** @format */
import { loadModules } from 'esri-loader';

interface Modules {
  MapView?: __esri.MapView;
  Geometry?: __esri.GeometryConstructor;
  Graphic?: __esri.GraphicConstructor;
  Point?: __esri.PointConstructor;
  Polyline?: __esri.PolylineConstructor;
  Polygon?: __esri.PolygonConstructor;

  Color?: __esri.ColorConstructor;
  Symbol?: __esri.SymbolConstructor;
  TextSymbol?: __esri.TextSymbolConstructor;
  SimpleFillSymbol?: __esri.SimpleFillSymbolConstructor;
  SimpleLineSymbol?: __esri.SimpleLineSymbolConstructor;
  SimpleMarkerSymbol?: __esri.SimpleMarkerSymbolConstructor;
  PictureMarkerSymbol?: __esri.PictureMarkerSymbolConstructor;
  PictureFillSymbol?: __esri.PictureFillSymbolConstructor;
  IdentityManager?: __esri.IdentityManager;
  SpatialReference?: any; // __esri.SpatialReferenceConstructor;
  Draw?: __esri.DrawConstructor;

  UnknownLayer?: __esri.UnknownLayerConstructor;
  GraphicsLayer?: __esri.GraphicsLayerConstructor;
  FeatureLayer?: __esri.FeatureLayerConstructor;
  GeoJSONLayer?: __esri.GeoJSONLayerConstructor;

  SketchViewModel?: __esri.SketchViewModelConstructor;
  PrintTask?: __esri.PrintTaskConstructor;
  PrintTemplate?: __esri.PrintTemplateConstructor;
  PrintParameters?: __esri.PrintParametersConstructor;
  Extent?: __esri.ExtentConstructor;
  ScreenPoint?: __esri.ScreenPoint;
  Collection?: __esri.Collection;
  Menu?: any;
  MenuItem?: any;

  Popup?: __esri.PopupConstructor;
  TextContent?: __esri.TextContentConstructor;
  PopupTemplate?: __esri.PopupTemplateConstructor;
  Zoom?: __esri.ZoomConstructor;
  Locate?: __esri.LocateConstructor;
  NavigationToggle?: __esri.NavigationToggleConstructor;
  Compass?: __esri.CompassConstructor;
  Measurement?: __esri.MeasurementConstructor;
  Swipe?: __esri.SwipeConstructor;
  TimeSlider?: __esri.TimeSliderConstructor;
  ScaleBar?: __esri.ScaleBarConstructor;

  Editor?: __esri.EditorConstructor;
  Domain?: __esri.DomainConstructor;
  CodedValueDomain?: __esri.CodedValueDomainConstructor;
  FieldConfig?: __esri.FieldConfigConstructor;
  FieldInfo?: __esri.FieldInfoConstructor;
  FeatureFormViewModel?: __esri.FeatureFormViewModelConstructor;
  FeatureForm?: __esri.FeatureFormConstructor;

  LabelClass?: __esri.LabelClassConstructor;
  Renderer?: __esri.RendererConstructor;
  SimpleRenderer?: __esri.SimpleRendererConstructor;
  UniqueValueRenderer?: __esri.UniqueValueRendererConstructor;

  ClassBreaksRenderer?: __esri.ClassBreaksRendererConstructor;
  QueryTask?: __esri.QueryTaskConstructor;
  Query?: __esri.QueryConstructor;
  Content?: __esri.ContentConstructor;
  config?: __esri.config;
  urlUtils?: __esri.urlUtils;
}

var defaultModulesPath = [
  'esri/config',
  'esri/core/urlUtils',
  'esri/core/Collection',
  'esri/identity/IdentityManager',
  'esri/Basemap',
  'esri/geometry/Extent',
  'esri/geometry/SpatialReference',
  'esri/Ground',
  'esri/layers/TileLayer',
  'esri/layers/GraphicsLayer',
  'esri/layers/FeatureLayer',
  'esri/renderers/Renderer',
  'esri/renderers/SimpleRenderer',
  'esri/renderers/UniqueValueRenderer',
  'esri/renderers/ClassBreaksRenderer',

  'esri/layers/support/LabelClass',
  'esri/layers/UnknownLayer',
  'esri/tasks/QueryTask',
  'esri/tasks/support/Query',

  'esri/layers/GeoJSONLayer',

  'esri/Graphic',
  'esri/geometry/Point',
  'esri/geometry/Polyline',
  'esri/geometry/Polygon',

  'esri/Color',
  'esri/symbols/Symbol',
  'esri/symbols/TextSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/symbols/PictureFillSymbol',

  'esri/views/draw/Draw',
  'esri/widgets/Sketch/SketchViewModel',

  'esri/tasks/PrintTask',
  'esri/tasks/support/PrintTemplate',
  'esri/tasks/support/PrintParameters',

  'dijit/Menu',
  'dijit/MenuItem',
  'dijit/MenuSeparator',

  'esri/PopupTemplate',
  'esri/popup/content/TextContent',

  'esri/widgets/Popup',
  'esri/widgets/Zoom',
  'esri/widgets/Locate',
  'esri/widgets/NavigationToggle',
  'esri/widgets/Compass',
  'esri/widgets/Measurement',
  'esri/widgets/Swipe',
  'esri/widgets/TimeSlider',
  'esri/widgets/ScaleBar',
  'esri/widgets/Legend',
];

// 编辑模块
const editorModulesPath = [
  'esri/layers/support/Domain',
  'esri/layers/support/CodedValueDomain',
  'esri/widgets/FeatureForm/FieldConfig',
  'esri/widgets/FeatureForm/FeatureFormViewModel',
  'esri/widgets/Editor',
];

// 全局使用
export let modules: Modules = {};

export const getModuleName = (path) => {
  var paths = path.split('/');
  return paths[paths.length - 1];
};

export const loadModulesPath = (paths) => {
  let modulesPath = [];
  paths.forEach((x) => {
    const name = getModuleName(x);

    if (!modules[name]) {
      modulesPath.push(x);
    }
  });

  return modulesPath;
};

/**
 * 加载常用的模块
 */
async function __initModules(paths): Promise<any> {
  const modulesPath = loadModulesPath(paths);
  let names = modulesPath.map(getModuleName);

  const modulesArray = await loadModules(modulesPath);
  for (let i = 0; i < names.length; i++) {
    modules[names[i]] = modulesArray[i];
  }
}

export async function initModules(): Promise<any> {
  await __initModules(defaultModulesPath);
  await __initModules(editorModulesPath);
}
