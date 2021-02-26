import IdentityManager from 'esri/identity/IdentityManager';

export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val: any, key: string) => hasOwnProperty.call(val, key);
export const isArray = Array.isArray;
export const isMap = (val: any) => toTypeString(val) === '[object Map]';
export const isSet = (val: any) => toTypeString(val) === '[object Set]';
export const isDate = (val: any) => val instanceof Date;
export const isFunction = (val: any) => typeof val === 'function';
export const isString = (val: any) => typeof val === 'string';
export const isSymbol = (val: any) => typeof val === 'symbol';
export const isObject = (val: any) => val !== null && typeof val === 'object';
export const isPromise = (val: any) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
export const objectToString = Object.prototype.toString;
export const toTypeString = (value: any) => objectToString.call(value);

// 只能是一个点  string | Array<number | string>
export const formatToPoint = (pt: any) => {
  if (isObject(pt) && 'x' in pt && 'y' in pt) {
    return pt;
  }

  let pts = isString(pt) ? pt.split(',') : pt;

  pts = pts.map(parseFloat);

  if (pts.length == 4) {
    const [xmin, ymin, xmax, ymax] = pts as number[];
    return { xmin, ymin, xmax, ymax };
  } else if (pts.length == 2) {
    const [x, y] = pts as number[];
    return { x, y };
  }
};

const registerToken = (layList: Array<any>, token: string) =>
  layList.forEach(({ url, type }) => {
    IdentityManager.registerToken({
      server: url,
      token,
    });
  });

export default {
  registerToken,
  formatToPoint,
};
