/** @format */

import {
  hasOwn,
  isArray,
  isDate,
  isFunction,
  isString,
  isObject,
  camelize,
  capitalize,
} from '@vue/shared';

export {
  values,
  hasOwn,
  isArray,
  isDate,
  isFunction,
  isString,
  isObject,
  camelize,
  capitalize,
};

export { functionApply, invokeFns, collectionHandlers };

export {
  debounce,
  fromPairs,
  bindAll,
  defaultTo,
  property,
  isNil,
  isNull,
  isUndefined,
  toInteger,toNumber,
  isNumber,
  isInteger,
  isBoolean,
  constant,
  hasIn,
  uniqueId,
  cloneDeep
} from 'lodash-es';

import { values } from 'lodash-es';
 
import { functionApply, invokeFns, collectionHandlers } from './fn';

export const includesEnum = (list: Record<any, any>, val: number | string) => {
  return values(list).includes(val as any);
};

export const isNotEnumThrow = (list: Record<any, any>, val: number | string) => {
  if (!includesEnum(list, val)) {
    console.table(list);
    throw new Error(`类型不存在:${val}`);
  }
};

export const isKeysEqual = (target: any, keys: Array<string> | string) => {
  keys = isString(keys) ? keys.split(',') : keys;
  // console.log("keys",Object.keys(target).sort().join(), keys.sort().join(), target, keys);
  return Object.keys(target).sort().join() === keys.sort().join();
};


export const getDPI = () => {
  // if (!!window.screen.deviceXDPI) {
  //   return [window.screen.deviceXDPI, window.screen.deviceYDPI]
  // }

  var tmpNode = document.createElement('div');
  tmpNode.style.cssText =
    'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
  document.body.appendChild(tmpNode);
  const dpi = [tmpNode.offsetWidth, tmpNode.offsetHeight];
  tmpNode.parentNode.removeChild(tmpNode);

  return dpi;
};
