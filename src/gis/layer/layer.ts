/** @format */

import { modules } from '../core';

import { isString, isBoolean, isArray, isObject } from '../../shared';
import { createGraphic, isSymbolType } from '../common';

/**
 * 不使用箭头函数
 * 函数调用可以使用 apply,call,bind 绑定 this
  
 */

/**
 * 格式化layer的入参
 * @param param
 */
export const format = function (param, { tileInfo, spatialReference }) {
  if (param.opacity && param.opacity > 1) {
    console.error('透明度设置错误', param);
    throw new Error('透明度值范围在：[0,1]');
  }

  if ('sublayers' in param) {
    if (isString(param.sublayers)) {
      param.sublayers = JSON.parse(param.sublayers);
    }
    if (isArray(param.sublayers) && param.sublayers.length === 0) {
      delete param.sublayers;
    }
  }

  param.group = param.group || 'default';
  if (param.type == 'tile') {
    param.spatialReference = spatialReference;

    if (isBoolean(tileInfo) && !tileInfo) {
      // false 不处理
      return {
        id: param.id,
        priority: param.priority,
        url: param.url,
        type: param.type,
        visible: param.visible == true ? true : false,
        // visible: param.visible == undefined ? true : param.visible,
        group: param.group,
      };
    } else if (isObject(tileInfo)) {
      param.tileInfo = tileInfo;
      param.tileInfo.spatialReference = spatialReference;
    }
  }

  return Object.assign({}, param);
};

/**
 * 根据ID获取图层，不存在则创建
 * @param view
 * @param id 图层ID
 */
export const graphicsLayer = (view, id?: string, priority?: number): __esri.GraphicsLayer => {
  let _layer;

  if (!id) {
    _layer = new modules.GraphicsLayer();
    view.map.add(_layer);
  } else {
    _layer = view.map.findLayerById(id);

    if (!_layer) {
      _layer = new modules.GraphicsLayer({ id });
      let length = view.map.layers.filter((x) => x['priority'] < priority).length;
      _layer['priority'] = priority || 0;

      !!priority ? view.map.add(_layer, length) : view.map.add(_layer);
    }
  }
  return _layer;
};

/**
 * 图层操作：
 * 1、图形：增加、删除（需指定图形ID）
 * 2、
 * @param view
 * @param layer
 */
export function graphicsLayerControl(view: __esri.View, layer: __esri.GraphicsLayer) {
  return {
    add(geometry: IGeometry, attrs?: object, symbol?: __esri.Symbol) {
      isSymbolType(attrs) && ((symbol = attrs as __esri.Symbol), (attrs = undefined));

      if (isString(attrs)) {
        attrs = { __id: attrs };
      } else if ('id' in geometry && isString(geometry['id'])) {
        attrs = { __id: geometry['id'] };
      }

      var graphic = createGraphic(view, geometry, attrs, symbol);
      layer.add(graphic);
      return graphic;
    },

    /**
     * 可传入 id 用于删除图形
     * @param geoList
     * @param cb
     */
    addMany(geoList: Array<any>, cb) {
      const graphics = geoList.map((geometry) => {
        let symbol = !cb ? {} : cb(geometry);

        let attrs = undefined;

        if (isString(geometry['id'])) {
          attrs = { __id: geometry['id'] };
        }

        return createGraphic(view, geometry, attrs, symbol);
      });

      layer.addMany(graphics);
    },

    delete(id: string) {
      if (!isString(id)) {
        console.error('delete.id错误', id);
        return;
      }
      let graphic = layer.graphics.find(
        (x) => x.attributes['__id'] == id || x.attributes['id'] == id
      );
      graphic && layer.remove(graphic);
    },
    /**
     * 清空图层
     */
    removeAll() {
      layer.removeAll();
    },
  };
}

export const registerToken = ({ url, layerUrl, token }, _token?: string) => {
  !!(url || layerUrl) &&
    modules.IdentityManager.registerToken({
      server: url || layerUrl,
      token: token || _token,
    });
};
