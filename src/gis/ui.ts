/** @format */

import { modules } from './core';
// 索引签名: https://basarat.gitbook.io/typescript/type-system/index-signatures

/*
 widgets GIS的变量
*/
export default (view: __esri.View, widgets: any, list:Array<any>) => {
  Object.keys(list).forEach((key: string) => {
    let param = list[key];

    if (typeof param == 'boolean') {
      param = {};
    }

    param.view = view;
    let positionUI =
      param.positionUI == undefined ? 'manual' : param.positionUI;

    var component = new modules[key](param);
    view.ui.add(component, positionUI);
    widgets[key] = component;
  });
};

const getMapPointFromMenuPosition = (view: any, box: any) => {
  var { x, y } = box;
  switch (box.corner) {
    case 'TR':
      x += box.w;
      break;
    case 'BL':
      y += box.h;
      break;
    case 'BR':
      x += box.w;
      y += box.h;
      break;
  }

  return view.toMap({
    x: x - view.position[0],
    y: y - view.position[1],
  });
};

// 右键菜单
export const menu = (view: any, list) => {
  let point: any = null;
  let menu = new modules.Menu({});

  menu.onOpen = (box: any) => {
    point = getMapPointFromMenuPosition(view, box);
  };

  list.forEach((x) => {
    const { onClick } = x;
    x.onClick = (ev: any) => {
      ev.point = point;
      onClick(ev);
    };
    menu.addChild(new modules.MenuItem(x));
  });

  //记住必须开启
  menu.startup();
  menu.bindDomNode(view.container);

  return menu;
};
