/** @format */

import { TriggerOpTypes } from './operation';

export function effect(fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect(); // 默认就要执行
  }
}

const effectStack = [];
let activeEffect;
let uid = 0;

function createReactiveEffect(fn, options) {

  // trigger 调用此函数，然后再次执行依赖收集（完整过程再执行一次）
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;

        return fn();
      } catch (error) {
        console.log(error);
      } finally {

        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.options = options;
  effect.id = uid++;
  effect.deps = [];
  return effect;
}

const targetMap = new WeakMap();
/**
 * 收集effect
 */
export function track(target, type, key) {

  if (activeEffect === undefined) {
    return; // 说明当前的取值操作没有在effect下，并没有依赖于effect
  }
  let depsMap = targetMap.get(target);  
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); // 让这个effect记录dep属性。?? 用途
  }
}

/**
 * 收集effect
 */
export function track11(target, type, key) {

  let dep =  new Set()  // 相应函数
  dep.add(activeEffect);

  let depsMap = new Map(); // 设置属性映射
  depsMap.set(key, dep);
  targetMap.set(target, depsMap); // 设置对象映射

  activeEffect.deps.push(dep);
}

/**
 * 触发通知
 */
export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);  // 从对象映射中获取属性映射
  if (!depsMap) {
    return;
  }
  const run = (effects) => {
    if (effects) {
      debugger
      effects.forEach((effect) => effect());
    }
  };
  if (key !== null) {
    run(depsMap.get(key)); // 获取属性的函数
  }
  if (type === TriggerOpTypes.ADD) {
    run(depsMap.get(Array.isArray(target) ? 'length' : ''));
  }
}
