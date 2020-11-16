/** @format */

import { constant, isNil } from '.';

function test() {
  /*

   */

  const fn = constant(234234);

  // console.log(fn());

  function fnc(value) {
    return function () {
      return value;
    };
  }
  /**
   * 第一个参数解构 [key, val]
   */
  Object.entries({ a: 11, b: 22 }).forEach(([key, val]) => {
    // console.log(val, key);
  });

  let test = Number.isNaN(null);

  console.log(isNil(null), isNil(undefined));
  console.log();

  function BIG(_) {
    const view = _;
    class Test {
      private _d: string;
      aa() {
        const b = view.a;
        console.log(b);
      }
      static bb() {
        console.log();
      }
      a() {
        console.log();
      }
      b() {
        console.log();
      }
      get ddd() {
        return 'dd';
      }
      set ddd(d) {
        this._d = d;
      }
    }

    return {
      Test,
    };
  }

  const Test = BIG({ a: 1 }).Test;

  const t = new Test();

  t.aa();

  /*

   */
}

export default test;
