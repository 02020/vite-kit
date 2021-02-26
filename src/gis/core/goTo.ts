/** @format */

import { functionApply } from '../../shared';
import { shapeStrategy, isShapeType, isGraphicType } from '../common';
import { formatToPoint, panExtentFromPoint } from '.';
import { isArray } from 'lodash-es';

const _goTo = (view: __esri.MapView, pt, zoom) => {
  let target: any = '';
  if (!!pt.graphic) {
    pt.graphic.geometry.spatialReference = view.spatialReference;
    target = pt.graphic;
    !zoom ? view.goTo(target) : view.goTo({ target, zoom });
  } else if (isGraphicType(pt)) {
    pt.geometry.spatialReference = view.spatialReference;
    !zoom ? view.goTo(pt) : view.goTo({ target: pt, zoom });
  } else {
    pt = formatToPoint(pt);
    goToExtend(view, pt, zoom);
  }
};

/**
 * 在92坐标系下面使用
 * 根据图形定位
 * @param view
 * @param id
 * @param zoom
 */
const goToExtend = (view, pt, zoom) => {
  let extent = view.extent,
    cz = zoom - view.zoom;

  if (!extent) {
    console.error(view);
    throw new Error('view 中不存在extent');
  }

  let factor = cz > 0 ? 0.5 : 2;
  cz = Math.abs(cz);
  while (cz > 0) {
    extent = extent.expand(factor);
    cz--;
  }

  let geo = panExtentFromPoint(pt, extent);
  let graphic = shapeStrategy(view).polyline(geo);

  view.goTo(graphic);
};

/**
 * 定位
 * @param view
 * @param args
 */
export const goTo = (view: __esri.MapView, args) => {
  /**
   * 一个入参
   * @param param
   */
  const paramOne = (param) => {
    if (typeof param === 'string') {
      if (param.indexOf(',') > -1) {
        let [xmin, ymin, xmax, ymax] = param.split(',');

        let graphic = shapeStrategy(view).polyline([
          [xmin, ymin],
          [xmax, ymax],
        ]);

        view.goTo(graphic);
      } else {
        let layer = view.map.findLayerById(param) as __esri.GraphicsLayer;
        !layer ? console.log('图层不存在无法定位') : view.goTo(layer.graphics);
      }
    } else if ('graphics' in param) {
      let layer = param;
      view.goTo(layer.graphics);
    } else if (isArray(param)) {
      if (param.length == 2) {
        // [55555,5000]
        param = shapeStrategy(view).point(param);
      } else {
        // 1212
        param = param.map((x) => {
          const type = isShapeType(x);
          return shapeStrategy(view)[type](x);
        });
      }
      view.goTo(param);
    } else {
      view.goTo(param);
    }
  };

  const paramTwo = (...args) => {
    // 两个参数
    const [pt, opts] = args;

    if (typeof opts === 'string' || typeof opts === 'number') {
      _goTo(view, pt, opts);
    } else {
      // 走默认的 opts 为配置文件
      view.goTo(args[0], args[1]);
    }
  };

  return functionApply(args, paramOne, paramTwo);
};