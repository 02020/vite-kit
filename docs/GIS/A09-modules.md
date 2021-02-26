## GIS模块

对应使用 arcgis 插件的部分 打包后需要增补的内容

```ts
 import EsriMap from 'esri/Map'
import MapView from 'esri/views/MapView'
import Ground from "esri/Ground"
import Extent from "esri/geometry/Extent"
import SpatialReference from "esri/geometry/SpatialReference"

import Graphic from "esri/Graphic"
import Color from "esri/Color"
import Point from "esri/geometry/Point"
import Polyline from "esri/geometry/Polyline"
import Polygon from "esri/geometry/Polygon"

import esri_Symbol from 'esri/symbols/Symbol'
import TextSymbol from "esri/symbols/TextSymbol"
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol"
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol"
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol"
import PictureMarkerSymbol from "esri/symbols/PictureMarkerSymbol"
import UniqueValueRenderer from 'esri/renderers/UniqueValueRenderer'
import LabelClass from 'esri/layers/support/LabelClass'
import WebTileLayer from 'esri/layers/WebTileLayer'
import MapImageLayer from 'esri/layers/MapImageLayer'
import IdentityManager from 'esri/identity/IdentityManager'
import GraphicsLayer from "esri/layers/GraphicsLayer"
import FeatureLayer from 'esri/layers/FeatureLayer'
import TileLayer from 'esri/layers/TileLayer'

import PrintTask from "esri/tasks/PrintTask"
import PrintTemplate from "esri/tasks/support/PrintTemplate"
import PrintParameters from "esri/tasks/support/PrintParameters"

import Menu from 'dijit/Menu'
import MenuItem from 'dijit/MenuItem'
import MenuSeparator from 'dijit/MenuSeparator'
import Popup from 'esri/widgets/Popup'
import PopupTemplate from 'esri/PopupTemplate'

import Zoom from 'esri/widgets/Zoom'
import Locate from 'esri/widgets/Locate'
import NavigationToggle from 'esri/widgets/NavigationToggle'
import Compass from 'esri/widgets/Compass'
import Measurement from "esri/widgets/Measurement"
import Swipe from 'esri/widgets/Swipe';
import TimeSlider from 'esri/widgets/TimeSlider';
import ScaleBar from 'esri/widgets/ScaleBar'

import SketchViewModel from "esri/widgets/Sketch/SketchViewModel"
import Editor from 'esri/widgets/Editor'
import FieldConfig from 'esri/widgets/FeatureForm/FieldConfig'
import Domain from 'esri/layers/support/Domain'
import CodedValueDomain from 'esri/layers/support/CodedValueDomain'


let modules = {
  EsriMap, MapView, SketchViewModel,
  Editor, Domain, CodedValueDomain, FieldConfig,
  PrintTask, PrintTemplate, PrintParameters,
  GraphicsLayer, FeatureLayer, MapImageLayer,
  TileLayer,
  Ground, Extent, SpatialReference, Point, Polyline, Polygon,
  Color,
  Symbol: esri_Symbol, TextSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
  UniqueValueRenderer, LabelClass,

  Graphic, WebTileLayer,
  Menu, MenuItem, MenuSeparator, Popup, PopupTemplate,
  ScaleBar, TimeSlider, Swipe, Measurement, NavigationToggle, Compass, Locate, Zoom,
  IdentityManager
};

```
