/**
 * 根据items中的值，提取values中的数据，返回对象
 * @format
 * @param { Array } items  ["name", "age","sex"]
 * @param { Object } values {name: "", age: 12, sex: 1, level:2 }
 * @return { Object }  { name: '', age: 12, sex: 1 }
 */

const reduce = (items, values) => {
  if (Array.isArray(items) && items.length) {
    return {};
  }
  return items.reduce((initial, current) => {
    initial[current] = values[current];
    return initial;
  }, {});
};

// key,items
// 根据关键字将数组转换成对象
/**
 * 
 * @param list  [ { key: 'l', name: '林', value: 22 },
                  { key: 'w', name: '王', value: 12 } ]
 * @param key key
 * @param value value
 * @return { Object }  { l: 22, w: 12 }
 */
function arrayToObject(list, key = 'key', value = 'value') {
  if (!Array.isArray(list)) {
    return {};
  }
  return list.reduce((initial, o) => {
    initial[o[key]] = o[value];
    return initial;
  }, {});
}




    //Array.isArray(obj)
    //数组转换成对象
    function ArrayToObject(list, key, value) { 

      var o = {};
      for (var i = 0; i < list.length; i++) {
          o[list[i][key]] = list[i][value];
      }
      return o;
  }


  // Array.prototype.ToObject = function (key, value) {
  //     var
  //         o = {},
  //         flag = !value ? true : false;

  //     if (!key || !this[0][key]) {
  //         return new Error('关键字异常');
  //     }
  //     this.forEach(function (item) {
  //         if (!!o[item[key]]) {
  //             console.error("关键字重复！", key);
  //         } else {
  //             o[item[key]] = flag ? item : item[value];
  //         }

  //     });
  //     return o;
  // }










export { reduce, arrayToObject };
