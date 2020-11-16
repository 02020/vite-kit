/** @format */

import { modules } from '../core';
import { PolylineStyle, isSymbolType } from './';
import {
  includesEnum,
  isObject,
  isKeysEqual,
  functionApply,
  isString,
} from '../../shared';

export const createColor = (param) => {
  return new modules.Color(param);
};

function randomColor() {
  return createColor([randomNum(255), randomNum(255), randomNum(255), 0.7]);
}

function randomNum(max) {
  var num = Math.random() * max;
  return max > 1 ? Math.ceil(num) : num;
}

/**
 * 点线面
 * @param {*} type
 */
const createDefaultSymbol = (type) => {
  if ('polygon,rectangle,fill,area'.indexOf(type) > -1) {
    return new modules.SimpleFillSymbol({
      outline: createDefaultSymbol('line'),
      color: randomColor(),
    });
  }

  if (type === 'line' || type === 'polyline') {
    return new modules.SimpleLineSymbol({
      color: randomColor(),
      width: 4,
    });
  }

  if (type === 'text') {
    const text = new modules.TextSymbol({
      color: '#000',
      text: '请输入',
      xoffset: 0,
      yoffset: 0,
      font: {
        size: 20,
        family: 'sans-serif',
      },
    });
    return text;
  }
};

//  let [size, style, color, fillColor] = args;
export const symbolStrategy = (name: string) => {
  let point = create(8, 'diamond', 'palegreen', 'seagreen');
  let polyline = create(1, 'dash', 'rgb(255, 0, 0)');
  let text = create(12, 'text', 'rgb(255, 0, 0)', 'arcgis font title');

  let polygon = create(
    1,
    'solid',
    'rgb(48, 49, 51)',
    'rgba(102, 195, 255,0.3)'
  );

  if (name === 'pickup') {
    point = create(8, 'diamond', 'palegreen', 'seagreen');
    polyline = create(1, 'solid', 'rgb(255, 0, 0)');
    text = create(12, 'text', 'rgb(102, 195, 255)', 'arcgis font title');

    polygon = create(
      1,
      'diagonal-cross',
      'rgb(255, 0, 0)',
      'rgb(102, 195, 255)'
    );
  } else if ('renderer' === name) {
    point = create(8, 'diamond', 'palegreen', 'seagreen');
    polyline = create(1, 'solid', 'rgb(255, 0, 0)');
    text = create(12, 'text', 'rgb(102, 195, 255)', 'arcgis font title');

    polygon = create(
      1,
      'diagonal-cross',
      'rgb(255, 0, 0)',
      'rgb(102, 195, 255)'
    );
  }

  return { point, polyline, polygon, text };
};

const symbolMap = {
  SLS: 'SimpleLineSymbol',
  SMS: 'SimpleMarkerSymbol',
  PMS: 'PictureMarkerSymbol',
  SFS: 'SimpleFillSymbol',
  TS: 'TextSymbol',
};

//只有一个入参  调用默认参数
const paramOne = (symbol) => {
  if ('default,pickup,renderer'.indexOf(symbol) > -1) {
    return symbolStrategy(symbol);
  }

  if (isString(symbol)) {
    return createDefaultSymbol(symbol);
  }

  if (!isObject(symbol)) {
    return;
  }
  symbol.color && (symbol.color = new modules.Color(symbol.color));

  if (isKeysEqual(symbol, 'style,color,outline')) {
    // 面
    return new modules.SimpleFillSymbol(symbol);
  } else if (isKeysEqual(symbol, 'style,width,color')) {
    // 线
    return new modules.SimpleLineSymbol(symbol);
  } else if (isKeysEqual(symbol, 'style,size,color,outline')) {
    // 点
    return new modules.SimpleMarkerSymbol(symbol);
  } else if (isKeysEqual(symbol, 'height,width,url')) {
    // 点
    return new modules.PictureMarkerSymbol(symbol);
  } else if (
    isKeysEqual(symbol, 'color,text,size,family,style') ||
    isKeysEqual(symbol, 'color,size,family,style')
  ) {
    // 文字
    const { color, text, size, family, style } = symbol;
    return new modules.TextSymbol({
      color,
      text,
      xoffset: 0,
      yoffset: 0,
      horizontalAlignment: 'left',
      verticalAlignment: 'top',
      font: { size, family, style },
    });
  } else if (isSymbolType(symbol)) {
    return symbol.clone();
  } else {
    if (symbol.type && symbol.type.includes('esri')) {
      let name = symbolMap[symbol.type.replace('esri', '')];
      return modules[name].fromJSON(symbol);
    }
    console.error('非标准格式无法创建样式:', symbol);
  }
};

// 两个入参
const paramTwo = (...args) => {
  const [width, url] = args;
  if (['.png', '.jpg', '.svg'].indexOf(url.substr(-4)) > -1) {
    return new modules.PictureMarkerSymbol({
      url,
      width,
      height: width,
    });
  }

  // 宽度, 颜色
  return new modules.SimpleLineSymbol({
    style: 'solid',
    width: args[0],
    color: args[1],
  });
};

const paramThree = (...args) => {
  // 三个入参
  let [size, style, color] = args;

  if (['.png', '.jpg', '.svg'].indexOf(color.substr(-4)) > -1) {
    return new modules.PictureMarkerSymbol({
      url: color,
      width: size,
      height: style,
    });
  }

  color = new modules.Color(color);

  if (includesEnum(PolylineStyle, style)) {
    return new modules.SimpleLineSymbol({
      style,
      color,
      width: size,
    });
  }

  return new modules.TextSymbol({
    color,
    text: style,
    font: {
      size: size,
      family: 'CalciteWebCoreIcons',
    },
  });
};

const paramFour = (...args) => {
  let [size, style, color, fillColor] = args;

  fillColor = new modules.Color(fillColor);
  color = new modules.Color(color);

  if (style == 'text') {
    return new modules.TextSymbol({
      color: args[2],
      text: args[3],
      xoffset: 0,
      yoffset: 0,
      horizontalAlignment: 'left', // 点击事件范围的默认位置
      verticalAlignment: 'top', // 点击事件范围的默认位置
      font: {
        size: size,
        // family: '微软雅黑',
      },
    });
  }

  // 四个入参
  var flag =
    ['circle', 'diamond', 'cross', 'square', 'triangle', 'x'].indexOf(
      style as string
    ) > -1;

  if (flag) {
    return new modules.SimpleMarkerSymbol({
      style,
      size,
      color: fillColor,
      outline: {
        color,
        width: size * 0.1,
      },
    });
  }

  style = style.replace('cross-cross', 'cross');

  return new modules.SimpleFillSymbol({
    color: fillColor,
    style: style,
    outline: {
      color,
      width: size,
    },
  });
};

/**
 * [图标](http://www.ztgis.com:8868/arcgis_js_api/library/4.15/sdk/latest/guide/esri-icon-font/index.html)
 * @param size 大小
 * @param style 线宽样式:"dash"|"dash-dot"|"dot"|"long-dash"|"long-dash-dot"|"long-dash-dot-dot"|"none"|"short-dash"|"short-dash-dot"|"short-dash-dot-dot"|"short-dot"|"solid"
 * @param color 颜色
 */
function create(type: string | number);

/**
 *
 * @param width 宽度
 * @param color 颜色
 */
function create(width: number, color: string);

function create(size: number, style: string, color: string);

function create(size: number, style: string, color: string, fillColor: string);
/**
 *
 * @param size 大小
 * @param style "circle", "cross", "diamond", "square", "triangle", "x"
 * @param color 边框线的颜色(dash)
 * @param fillColor 填充的颜色
 */
function create(...args) {
  return functionApply(args, paramOne, paramTwo, paramThree, paramFour);
}

export { create as createSymbol };

/*
http://www.ztgis.com:8868/arcgis_js_api/library/4.15/sdk/latest/guide/esri-icon-font/index.html


 // Create a symbol for drawing the point
   

        
function temp() {
  let marker = new modules.SimpleMarkerSymbol({
    style: "diamond",
    size: 8,
    color: "palegreen",
    outline: { color: "seagreen", width: 0.5 },
  });

  marker = new modules.SimpleLineSymbol({
    width: 4,
    color: [0, 197, 255, 1],
  });
}

*/

/*
Value	Description
dash	sls-dash
dash-dot	sls-dash-dot
dot	sls-dot
long-dash	sls-long-dash
long-dash-dot	sls-long-dash-dot
long-dash-dot-dot	sls-dash-dot-dot
none	The line has no symbol.
short-dash	sls-short-dash
short-dash-dot	sls-short-dash-dot
short-dash-dot-dot	sls-short-dash-dot-dot
short-dot	sls-short-dot
solid	sls-solid

 case 'SimpleLineSymbol':
      return new SimpleLineSymbol({ width: 10, color: [0, 197, 255, 1] });
      break;
    case 'SimpleFillSymbol':
      return new SimpleFillSymbol({ outline: { width: 5, color: '#e74c3c' }, color: [152, 230, 0, 0.25] });
      break;
  */
