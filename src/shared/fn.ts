/** @format */

import { isArray, isFunction } from '.';

/**
 * 根据入参个数，调用不同的函数
 * 入参位置：1.参数 2.入参数量为1的函数 3.入参数量为2的函数  4......
 * @param args
 */
export const functionApply = (...args) => {
  const param = args.shift();
  for (let index = 0; index < args.length; index++) {
    if (index + 1 == param.length && isFunction(args[index])) {
      return args[index].apply(null, param);
    }
  }
};

/**
 * 数据集合转换
 * @param collection
 * @param cb
 */
export function collectionHandlers(collection, cb) {
  if (isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      cb(collection[i]);
    }
  } else if (collection instanceof Map) {
    collection.forEach((v, key) => {
      cb(collection.get(key));
    });
  } else if (collection instanceof Set) {
    collection.forEach((fn) => {
      cb(fn);
    });
  } else {
    for (const key in collection) {
      cb(collection[key]);
    }
  }
}

/**
 * 执行函数
 * @param fns
 * @param arg
 */
export function invokeFns(fns: any, arg) {
  collectionHandlers(fns, function (fn) {
    isFunction(fn) && fn(arg);
  });
}
