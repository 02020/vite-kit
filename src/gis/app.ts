/** @format */

import { loadScript } from 'esri-loader';
import { EsriBus, arcgis, initModules, modules, goTo, viewEvents, emitter, axios } from './core';
import { createSymbol, GIS, createColor, Index, shapeStrategy } from './common';
import withWidgets, { menu } from './ui';
import * as config from './config';
// import { flyTo } from './core/esri-api';
import {
  registerToken,
  Sketch,
  format,
  CreatePrintTask,
  ShapeLayer,
  update,
  initBaseLayers,
  FeatureLayerEditor,
  FeatureLayerRenderer,
  ShapeRenderer,
} from './layer';

import * as shared from '../shared';

// 合并方法
const utils = { ...shared, ...config };

class App extends EsriBus {
  static help: () => void;
  static Index: typeof Index;
  static shared: any;
  private view: __esri.MapView;
  private gis: any;

  public $u: any = utils;
  /**
   * 控制是否或是点击图形
   * @type {boolean}
   * @memberof App
   */
  public hitTest: boolean = false;

  /**
   * 点击是否显示弹窗
   * @type {boolean}
   * @memberof App
   */
  public isPopup: boolean = false;

  /**
   *
   * 当前加载的地图
   * @type {Array<any>}
   * @memberof App
   */
  public layerList: Array<any> = [];

  /**
   * 组件
   * @type {Widgets}
   * @memberof App
   */
  public widgets: any;

  /**
   *
   * 右键菜单
   * @type {*}
   * @memberof App
   */
  menu: any;

  /**
   * 接入后端请求
   * @type {*}
   * @memberof App
   */
  axios: any;
  mapViewOption: any;

  constructor(param?: any) {
    super();

    // 从外部导包接入请求
    if (param && param.axios) {
      this.axios = axios(param.axios);
    }
  }

  public async init(param: any): Promise<any> {
    const { url, fontsUrl, srCode } = param;
    const flag = srCode === 'xiamen92';
    let __param = { extent: '' };

    Object.assign(__param, config.setting, flag ? config.init92 : config.init2000, param);

    if (!!url) {
      await App.initArcGisJsApi(url);
    }
    if (!!fontsUrl) {
      modules.config.fontsUrl = fontsUrl;
    }

    await this.initMapView(__param);
    return this;
  }

  /**
   * 地图初始化
   * @param param
   */
  public async initMapView(param: any): Promise<any> {
    this.mapViewOption = param;
    const { token, wkid, country, layerList, container, wkt, widgets } = param;

    const spatialReference: any = new modules.SpatialReference({ wkid, wkt });

    const baseLayers = initBaseLayers({ spatialReference, country, layerList, token });

    this.layerList.push(...baseLayers);

    const map = await arcgis.createMap({
      basemap: {
        baseLayers,
        title: '底图',
        id: 'base',
      },
    });

    const viewProperties = config.getViewProperties(param, { container, map, spatialReference });
    this.view = await arcgis.createMapView(viewProperties);
    this.mapViewOption.spatialReference = this.view.spatialReference;
    this.withWidgets(widgets);

    // 地图事件接入
    viewEvents(this);

    // 需要等待视图加载完成，再执行其他操作
    if (baseLayers.length) {
      await this.view.when();
    }

    this.view.goTo(viewProperties.extent);

    // GIS 工具
    this.gis = GIS(this.view);
    this.emit('init', this.view);
    return this;
  }

  public withWidgets(widgets: any) {
    ['zoom', 'attribution'].forEach((x) => this.view.ui.remove(x));
    this.widgets = this.widgets || {};
    withWidgets(this.view, this.widgets, widgets || {});
    return this.widgets;
  }

  initMenu(list: any) {
    this.menu = menu(this.view, list);
    return this.menu;
  }

  /**
   * 加载在线的 arcgis-js-api
   * @param baseUrl
   */
  public static async initArcGisJsApi(baseUrl: string, cb?: any): Promise<void> {
    await loadScript({
      url: `${baseUrl}/init.js`,
      css: `${baseUrl}/esri/css/main.css`,
      dojoConfig: {
        async: true,
        locale: 'zh-cn',
        has: {
          'esri-native-promise': true,
        },
      },
    });

    await initModules();
    emitter.emit('loaded');

    cb && cb();
  }

  // 配置本地字体路径
  public withFontsUrl(url: string) {
    if (!url) return;
    modules.config.fontsUrl = url;
    return this
  }

  // 配置代理路径
  public withProxyRule({ urlPrefix, proxyUrl }) {
    modules.urlUtils.addProxyRule({ urlPrefix, proxyUrl });
    return this
  }

  // 获取图层
  private findLayerById(id: string): __esri.Layer {
    return this.view.map.findLayerById(id);
  }
  /**
   * 增加图层
   * @function add
   * @param {Object} layerInfo 图层信息
   * @param {String} group 组名
   */
  public async add(props, cb) {
    const { tileInfo, spatialReference } = this.mapViewOption;
    registerToken(props);
    props = format.call(this, props, { tileInfo, spatialReference });

    const { id } = props;
    let layer = this.findLayerById(id);
    if (!!layer) return layer;

    if (!props['type']) {
      console.error('type 不能为空', props);
      return;
    }

    layer = await arcgis.createLayer(props);

    this.layerList.push(layer);

    if (!!this.mapViewOption.country) {
      // layer.setMinScale(1.4774879652937502E8);
      // layer.setMinScale(1127.2338602399827);
    }

    if (props['priority'] || props['reorder']) {
      let priority = props['priority'] || 0,
        reorder = props['reorder'] || 0;
      reorder = this.view.map.layers.filter((x) => x['priority'] <= priority).length + reorder;
      this.view.map.add(layer, reorder);
    } else {
      this.view.map.add(layer);
    }

    cb && layer.when(cb);

    return this.view.whenLayerView(layer);
  }

  public async addMany(layList, priority) {
    if (!layList || layList.length === 0) return;
    const list = layList.map((props) => {
      registerToken(props, this.mapViewOption.token);
      return format.call(this, props, this.mapViewOption);
    });

    const layers = await arcgis.createLayers(list);
    this.layerList.push(...layers);
    this.view.map.addMany(layers, priority);
    return this.layerList;
  }

  public delete(id: string, oid: string) {
    const layer = this.findLayerById(id);
    layer && this.view.map.remove(layer);
  }

  public get(id: string) {
    // 如果为对象则获取相关属性

    let properties = 'center,extent,popup,size';
    return this.findLayerById(id);
  }

  public getMany(name: string) {
    return this.layerList.filter((x) => x.group == name);
  }

  public update(emitEntity: any) {
    update(this.view, emitEntity);
  }
  public goTo(...args) {
    goTo(this.view, args);
    // flyTo(this.view, args);
  }

  /**
   * 创建图形
   * @param id 图层ID
   * @param type 图形类型
   */
  public createShape(id: string, priority: number) {
    return new this.gis.Shape(id, priority);
  }

  public shape(id: string, priority: number) {
    return new this.gis.Shape(id, priority);
  }

  public symbol(...args: [string | number, string?, string?, string?]) {
    return createSymbol.apply(this, args);
  }

  public createSymbol(...args: [string | number, string?, string?, string?]) {
    return createSymbol.apply(this, args);
  }

  public createColor(...args) {
    return createColor.apply(null, args);
  }

  public createShapeLayer(id: string, symbol?: any) {
    return new ShapeLayer(this, id, symbol);
  }

  public createSketch(param?: string) {
    return new Sketch(this.view, param);
  }

  public printTask(view) {
    let __view = view || this.view;
    return new CreatePrintTask(__view, this);
  }

  // 调用GIS原生的编辑功能
  public widthEditor(id, fieldConfig: Array<any>) {
    let layer = this.findLayerById(id) as __esri.FeatureLayer;

    if (!layer) {
      throw new Error('FeatureLayer 不存在');
    }

    return FeatureLayerEditor(this.view, layer, fieldConfig);
  }

  // Shape 文件上传解析
  public createShapeRenderer(json) {
    return new ShapeRenderer(this.view, json);
  }

  public renderer(json) {
    return new FeatureLayerRenderer(this.view, json);
  }

  public viewInfo() {
    const { extent, center, scale, zoom, size } = this.view;
    const { xmin, ymin, xmax, ymax } = extent;
    const dpi = shared.getDPI();

    return {
      dpi,
      mapExtent: [xmin, ymin, xmax, ymax].join(','),
      imageDisplay: [size[0], size[1], dpi[0]].join(','),
      extent,
      center: { x: center.x, y: center.y },
      scale,
      size,
      zoom,
      layerList: this.layerList,
    };
  }
}

// 增加附属功能
App.help = () => {
  Object.keys(Index).forEach((x) => {
    console.table(Index[x]);
  });
};

/**
 *
 * 可在系统中使用的枚举
 * @static
 * @type {typeof Index}
 * @memberof App
 */
App.Index = Index;

/**
 * 常用函数及方法
 */
App.shared = utils;

export default App;
