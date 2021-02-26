/** @format */

import { createSymbol, createColor } from './symbols';
import { hasOwn, debounce, uniqueId } from '../../shared';

export * from './enum'
export * from './shared'
export { popupHandle } from './popup';
export { highlight } from './highlight';
export * from './Shape';
export { createSymbol , createColor};
/**
 *
 * 事件控制
 * @param {__esri.MapView} view
 * @returns
 */
const onEventHandler = (view: __esri.MapView) => {
  let eventHandles: Record<string, __esri.Handle> = {};
  let lastGraphic: __esri.Graphic;
  /**
   * 添加事件
   * @param eventName 事件名称
   * @param fn 需要执行的方法
   * @param 防抖延迟时间
   * @return void
   */
  const withEvent = (eventName, fn, delay?, leading = false) => {
    const name = eventName;
    if (hasOwn(eventHandles, name)) {
      eventHandles[name].remove();
    }

    if (!!delay) {
      eventHandles[name] = view.on(
        eventName,
        debounce(fn, delay, { leading: leading }) as __esri.EventHandler
      );
    } else {
      eventHandles[name] = view.on(eventName, fn);
    }
  };

  /**
   * 存在图形时，处理方式
   * @param cb 
   */
  const hitTest = (cb) => (ev) => {
    view.hitTest(ev).then((response) => {
      let features = response.results;
      if (features.length) {
        cb(features.map((x) => x.graphic));
      }
    });
  };

  return {
    withEvent,
    /**
     * 鼠标移开事件
     */
    onMouseLeave: (graphic, cb) => {
      let handle = (ev) => {
        view.hitTest(ev).then((response) => {
          let features = response.results;
          if (features.length) {
            lastGraphic = features[0].graphic;
          } else {
            if (!!lastGraphic && graphic == lastGraphic) {
              cb(lastGraphic);
              lastGraphic = null;
            }
          }
        });
      };

      withEvent('pointer-move', handle, 0);
    },
  
    /**
     * 监听鼠标点击事件
     * @param cb 
     */
    onClick: (graphic, cb) => {
      withEvent('click', hitTest(cb));
    },
    /**
     * 监听鼠标移动事件
     * @param cb 
     */
    onMove: (graphic, cb) => {
      withEvent('pointer-move', hitTest(cb));
    },

    /**
     * 移除指定事件或所有
     * @param name 事件名称
     */
    remove(name?: string) {
      // 移除事件
      if (!name) {
        Object.values(eventHandles).forEach((x) => x.remove());
      } else {
        eventHandles[name].remove();
      }
    },
  };
};

export { onEventHandler };
