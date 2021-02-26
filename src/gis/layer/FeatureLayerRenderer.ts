/** @format */

import { modules } from '../core';
import { createSymbol } from '../common';
import { isObject, isArray, isNil } from '../../shared';

export class FeatureLayerRenderer {
  private view: __esri.MapView;
  labelClass: __esri.LabelClass;
  featureLayer: __esri.FeatureLayer;
  labelingInfo: __esri.LabelClass[] = [];

  textSymbol: any;

  valueInfos: Array<any> = [];
  graphics: any; // __esri.Graphic[];
  highlight: any;
  shapes: any;

  constructor(view: __esri.MapView, rendererJSON: any) {
    this.view = view;
    let renderer: __esri.UniqueValueRenderer;

    if (rendererJSON) {
      renderer = modules.UniqueValueRenderer.fromJSON(rendererJSON);
    } else {
      renderer = new modules.UniqueValueRenderer({});
    }

    this.featureLayer = new modules.FeatureLayer({
      renderer: renderer,
      labelingInfo: [],
    });
  }
  /**
   * 覆盖所有
   * @param rendererJSON
   */
  withJSON(rendererJSON: any) {
    if (!!rendererJSON) {
      this.featureLayer.renderer = modules.UniqueValueRenderer.fromJSON(rendererJSON);
    }
    return this;
  }

  /**
   * 配置分类样式的字段
   * @param name
   */
  withName(name: string) {
    const renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;
    renderer.field = name;
    return this;
  }

  /**
   * 配置字段
   */
  withFields(fields: Array<any>) {
    this.featureLayer.fields = fields;
    // [
    //   { name: 'MC', type: 'string' },
    //   { name: 'LX', type: 'string' },
    //   { name: 'OBJECTID', type: 'oid' },
    // ];
  }
  /**
   * 图形数据
   * @param shapes
   */
  withSource(shapes: any) {
    const graphics: __esri.Graphic[] = shapes.map((x: any) => {
      let g = modules.Graphic.fromJSON(x);
      g.geometry.spatialReference = this.view.spatialReference;
      return g;
    });

    const fields = Object.keys(graphics[0].attributes).map((key, index) => {
      return { name: key, type: index == 0 ? 'oid' : 'string' };
    });

    this.shapes = shapes;
    this.graphics = graphics;

    this.featureLayer.fields = fields;
    this.featureLayer.source = graphics;
    return this;
  }

  /**
   * 增加默认样式
   * @param symbol
   */
  withSymbol(...symbol: any) {
    let renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;

    if (
      'text' in symbol[0] ||
      'point' in symbol[0] ||
      'polyline' in symbol[0] ||
      'polygon' in symbol[0]
    ) {
      symbol = [symbol[0][this.graphics[0].geometry.type]];
    }

    renderer.defaultSymbol = createSymbol.apply(null, symbol);
    return this;
  }

  /**
   * 弹窗
   * @param title
   */
  withPopup(title: any) {
    this.featureLayer.popupEnabled = true;

    let content = null;
    if (Array.isArray(this.featureLayer.fields)) {
      let fieldInfos = this.featureLayer.fields.map((x) => {
        return { fieldName: x.name, label: x.name };
      });
      content = [{ type: 'fields', fieldInfos }];
    }

    this.featureLayer.popupTemplate = new modules.PopupTemplate({
      title: title,
      content,
      outFields: ['*'],
    });

    return this;
  }

  /**
   * 标签显示内容
   * @param name 字段名称
   * @param symbol 样式
   */
  withLabel(name: string, symbol?: any, only?: boolean) {
    if (!name) return this;

    this.textSymbol = !symbol ? this.textSymbol : symbol;
    const labelClass = new modules.LabelClass({
      labelExpressionInfo: { expression: `$feature.${name}` },
      symbol: createSymbol(this.textSymbol),
    });

    labelClass.set('name', name);
    if (only) {
      this.featureLayer.labelingInfo = [labelClass];
    } else {
      this.featureLayer.labelingInfo.push(labelClass);
    }

    return this;
  }

  /**
   * Adds a unique value and symbol to the renderer.
   * @param value 字段值
   * @param symbol 样式
   * @param only 是否清空之前
   */
  withRenderer(value: string | number | any, symbol?: __esri.Symbol | any, only?: boolean) {
    !!only && this.removeUniqueValueInfo();
    let renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;

    if (isArray(value)) {
      value.forEach((x) => {
        if (!!x && x.symbol && x.value) {
          renderer.addUniqueValueInfo({
            value: x.value,
            symbol: createSymbol(x.symbol),
          });

          this.valueInfos.push(x);
        }
      });
    } else {
      renderer.addUniqueValueInfo(value, createSymbol(symbol));
      this.valueInfos.push(value, symbol);
    }
    return this;
  }

  /**
   * Removes a unique value from the renderer.
   * @param value
   */
  removeUniqueValueInfo(value?: string) {
    const renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;

    if (value) {
      renderer.removeUniqueValueInfo(value);
    } else {
      renderer.uniqueValueInfos.forEach((element) => {
        renderer.removeUniqueValueInfo(element.value as string);
      });

      this.valueInfos.splice(0, this.valueInfos.length);
    }

    this.featureLayer.renderer = renderer.clone();
    return this;
  }

  /**
   * 修改透明度
   * @param value
   */
  withOpacity(value: number) {
    this.featureLayer.opacity = value / 100;
    return this;
  }

  /**
   * 增加到图层
   */
  build() {
    this.view.map.add(this.featureLayer);
    return this;
  }

  destroy() {
    this.view.map.remove(this.featureLayer);
    this.featureLayer.destroy();
    return this;
  }

  /**
   * 执行样式更新
   */
  update() {
    const renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;

    this.featureLayer.renderer = renderer.clone();
    return this;
  }

  filter(value: any) {
    let graphics = this.featureLayer.source.toArray();
    if (!!value) {
      const field = this.featureLayer.objectIdField;
      graphics = graphics.filter((x) => x.getAttribute(field) === value);
    }
    return graphics;
  }
  /**
   * 定位
   */
  goTo(oid: any) {
    if(!oid) return this;
    this.view.goTo(this.filter(oid));
    return this;
  }

  light(oid: any) {
    this.view.whenLayerView(this.featureLayer).then((layerView) => {
      this.highlight && this.highlight.remove();
      this.highlight = layerView.highlight(this.filter(oid));
    });
    return this;
  }

  /**
   * 图形显隐
   * @memberof FeatureLayerRenderer
   */
  set visible(value) {
    this.featureLayer.visible = value;
  }
  get visible() {
    return this.featureLayer.visible;
  }

  /**
   * 图层透明度
   * @memberof FeatureLayerRenderer
   */
  set opacity(value: any) {
    this.withOpacity(value);
  }

  /**
   * 获取信息
   */
  info() {
    const f = this.featureLayer,
      renderer = f.renderer as __esri.UniqueValueRenderer,
      first = f.labelingInfo[0];
    let labelClass = {};

    if (!!first) {
      labelClass = {
        name: first.labelExpressionInfo.expression.replace('$feature', ''),
        symbol: first.symbol,
      };
    } else {
      // 默认配置
    }

    return {
      geometryType: f.geometryType,
      labelingInfo: f.labelingInfo,
      labelClass, // 标注样式
      field: renderer.field, // 分类字段
      valueInfos: renderer.uniqueValueInfos,
      fields: f.fields, //字段列表
    };
  }

  get renderer() {
    return this.featureLayer.renderer;
  }

  /**
   * 分类字段
   * @readonly
   * @memberof FeatureLayerRenderer
   */
  get fields() {
    return this.featureLayer.fields;
  }
}

const createRow = function (value: any, enable: any, symbol: any) {
  return {
    value,
    enable,
    symbol,
    graphic: {
      attributes: {
        symbol,
      },
    },
  };
};

export class ShapeRenderer extends FeatureLayerRenderer {
  DEFAULT_NAME: string = '默认样式';
  rendererType: string = 'simple';
  tableData: any;
  lastParams: any;
  simpleSymbol: any;
  defaultSymbol: any;

  constructor(view: __esri.MapView, rendererJSON: any) {
    super(view, rendererJSON);
  }

  /**
   * 单一样式
   * @param symbol
   */
  withSimple(symbol: any) {
    this.rendererType = 'simple';
    if (!!symbol) {
      this.simpleSymbol = symbol;
      this.removeUniqueValueInfo(); // 移除分类样式
      let renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;
      renderer.defaultSymbol = createSymbol(symbol);
      this.featureLayer.renderer = renderer.clone();
    }

    return this;
  }

  /**
   * 分类样式
   * @param tableData
   */
  withUniqueValue(tableData) {
    this.rendererType = 'unique';

    const defaultSymbol = tableData.find((x) => x.value == this.DEFAULT_NAME).symbol;
    const values2 = tableData
      .filter((x) => x.enable && x.symbol && x.value != this.DEFAULT_NAME)
      .map((x) => {
        return {
          value: x.value,
          symbol: x.symbol,
        };
      });

    if (!!defaultSymbol) {
      this.defaultSymbol = defaultSymbol;
      this.withSymbol(defaultSymbol).withRenderer(values2, null, true).update();
    }
    return this;
  }

  /**
   * 修改渲染方法
   * @param val
   */
  withRendererType(val: string) {
    this.rendererType = val;
    return this;
  }

  /**
   * 修改分类字段
   * @param val
   */
  withField(field) {
    this.withName(field);
    this.removeUniqueValueInfo();
    this.createTableData(field);
    return this;
  }

  /**
   * 执行渲染
   * @param symbol  单一样式
   * @param tableData 分类样式
   */
  execute(symbol, tableData) {
    if ('simple' == this.rendererType) {
      !isNil(symbol) && this.withSimple(symbol);
    } else if ('unique' == this.rendererType) {
      !isNil(tableData) && this.withUniqueValue(tableData);
    }
    return this;
  }

  /**
   * 更新
   */
  refresh() {
    return this;
  }

  // 打开、重置时解析shapeInfo
  initStyle() {
    const f = this.featureLayer,
      renderer = f.renderer as __esri.UniqueValueRenderer,
      first = f.labelingInfo[0];

    // todo 标注默认样式
    let labelName = !!first ? first.labelExpressionInfo.expression.replace('$feature.', '') : '';

    const lastParams = {
      rendererType: this.rendererType, // 样式类型
      geometryType: f.geometryType,
      labelName, // 标注字段
      labelSymbol: this.textSymbol, // 标注样式
      simpleSymbol: this.simpleSymbol, // 简单样式-默认样式
      field: renderer.field, // 分类字段
      fields: f.fields, //字段列表
      tableData: null,
    };

    this.lastParams = JSON.stringify(lastParams);
    lastParams.tableData = this.createTableData(renderer.field); // 分类样式
    return lastParams;
  }

  /**
   * 根据字段获构建表格数据 tableData?: any
   * value, enable,graphic
   * @param field
   */
  createTableData(field) {
    let m = new Map();

    const renderer = this.featureLayer.renderer as __esri.UniqueValueRenderer;

    m.set(this.DEFAULT_NAME, createRow(this.DEFAULT_NAME, true, this.defaultSymbol));
    //     renderer.uniqueValueInfos
    this.valueInfos.forEach((x) => {
      m.set(x.value, createRow(x.value, true, x.symbol));
    });

    !!field &&
      this.featureLayer.source.toArray().forEach((x) => {
        const value = x.attributes[field];
        if (!!value && !m.has(value)) {
          m.set(value, createRow(value, false, null));
        }
      });

    this.tableData = [...m.values()];

    return this.tableData;
  }
  // 放弃修改
  reset() {
    let params = JSON.parse(this.lastParams);
    params.tableData = this.createTableData(params.field);
    return params;
  }

  /**
   * 根据字段获取值
   * @param field
   */
  getValuesFromField(field: string) {
    let list: Array<any> = [];
    const oid = this.featureLayer.objectIdField;
    const label = this.featureLayer.labelingInfo[0];
    this.featureLayer.source.toArray().forEach((x) => {
      let o = {
        id: x.getAttribute(oid),
        value: x.getAttribute(field),
        label: label && x.getAttribute(label.name),
        attrs: x.attributes,
        geometry: x.geometry,
      };
      list.push(o);
    });

    return list;
  }

  toJSON() {}
}
