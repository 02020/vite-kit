/** @format */

import { modules } from '../core';
import { onEventHandler } from '.';
import { isNil } from 'lodash-es';

interface WithHandleOption {
  name: string; // 事件名称
  delay: number;
  leading: boolean;
  key?: string; // 事件触发的关键字
  value?: any;
  title: string; //
  component: any;
}

export const popupHandle = (view: __esri.MapView, layer: __esri.Layer) => {
  let emitter: any,
    enable: boolean = true, // 控制显隐
    onEvent = onEventHandler(view),
    lastEvent: any,
    contents: any = {}, //需要显示的弹窗
    keyField: any = {};

  const withHandle = ({
    name,
    delay,
    key,
    leading,
    value,
    title,
    component,
  }: WithHandleOption) => {
    // "point", "点标绘", domPoint.value

    if (isNil(value)) {
      // 如果只传入key，设置key的默认值为__mark，传入的为值
      value = key;
      key = '__mark';
    }
    let type = `${name}-${key}-${value}`;
    keyField[name] = key;

    // console.log(textElement)
    contents[type] = new modules.PopupTemplate({
      title: title,
      content: component.$el || component,
    });
    onEvent.withEvent(name, popupHandle, delay, leading);
  };

  const popupHandle: __esri.EventHandler = (ev) => {
    if (!enable) return;

    // 如果上一次是点击事件，则不关闭当前弹窗
    if (
      view.popup.visible &&
      !!lastEvent &&
      lastEvent.type == 'click' &&
      ev.type == 'pointer-move'
    ) {
      return;
    }

    view.hitTest(ev).then((response) => {
      let features = response.results.filter((x) => {
        return x.graphic.layer == layer;
      });

      if (features.length) {
        let graphics = features.map((x) => {
          let mark = x.graphic.getAttribute(keyField[ev.type]) || '';
          let type = ev.type + '-' + keyField[ev.type] + '-' + mark;
          x.graphic.popupTemplate = contents[type];
          return x.graphic;
        });

        view.popup.open({
          features: graphics,
          location: features[0].mapPoint,
        });

        if (!!features[0].graphic.attributes) {
          let mark = features[0].graphic.attributes.__mark;
          emitter && emitter(mark, features[0].graphic, features);
        }

        lastEvent = {
          type: ev.type,
          features,
        };
      } else {
        // 鼠标移除当前图形，则关闭弹窗
        if (
          ev.type == 'pointer-move' &&
          !!lastEvent &&
          lastEvent.type == 'pointer-move'
        ) {
          console.log('move');
          view.popup.close();
        }
      }
    });
  };

  return {
    effect(fn:any) {
      emitter = fn;
    },
    enable: (flag:any) => {
      enable = flag;
    },

    withClick(param: Omit<WithHandleOption, 'name,delay,leading'>) {
      // 点击事件频闪 leading
      withHandle({ name: 'click', delay: 500, leading: true, ...param });
    },

    withMove(param: Omit<WithHandleOption, 'name,delay,leading'>) {
      withHandle({
        name: 'pointer-move',
        delay: 100,
        ...param,
      });
    },

    clear(name?: string) {
      onEvent.remove(name);

      // 必须清空，不然点击事件不会失效
      lastFeatures.forEach((x) => (x.graphic.popupTemplate = null));
      view.popup.close();
    },
  };
};

// this.view.on('pointer-enter', (ev) => {
//   console.log(ev);
// });
