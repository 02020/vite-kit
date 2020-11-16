# 数组

## 简单

### filter

```ts
// 过滤重复
var resp = [ 'listeners', 'props', 'attrs', 'props'].filter(function (
  option,  i,  arr) {
  return arr.indexOf(option) === i;
});
// [ 'listeners', 'props', 'attrs' ]
```

### keys

#### 处理对象中是否存在指定数组中的对象

```ts
/**
 * ensures the keys always contain listeners/props/attrs
 * @param {*} options  {test:"", props:"", listeners:""}
 * @returns {*}  {test:"",props:"", listeners:"", "attrs"}
 */
var getOptionsKeys = function getOptionsKeys(options) {

  return Object.keys(options).concat(['listeners', 'props', 'attrs']).filter(function (option, i, arr) {
    return arr.indexOf(option) === i;
  });
};
```


```ts

/**
 * 递归函数 - Infinite
 * @param {*} list 需要拍平的数据
 * @param {*} key children 的字段名
 * @param {*} last 递归的数组
 * @param {*} initialValue 初始数组
 */
var flattenInfinite = (list, key, last, initialValue) => {
  list.forEach((node) => {

    const __data = last.length ? [...last, node] : [node];

    if (node[key] && node[key].length) {
      flattenInfinite(node[key], key, __data, initialValue);
    } else {
      initialValue.push(__data);
    }
  });
};

/**
 * 根据条件过滤一个对象数组，同时过滤掉未指定的键（key）。
 * @param {*} data
 * @param {*} keys
 * @param {*} fn
 * @from 30-seconds
 */
const reducedFilter = (data, keys, fn) =>
  data.filter(fn).map((el) =>
    keys.reduce((acc, key) => {
      acc[key] = el[key];
      return acc;
    }, {})
  );

/**
 * 拍平数据字段为children的数据
 * @param {*} data 需要处理的数据
 * @example data
 * [ { v: 'jiangsu', l: '江苏', children: [ { v: 'nanjing', l: '南京', children: [ { v: 'f', l: '夫子庙', }, ], }, { v: 'suzhou', l: '苏州', children: [ { v: 'z', l: '拙政园', children: [ { v: '1', l: 'a', children: [ { v: '2', l: 'b', }, ], }, ], }, { v: 'z', l: '狮子林', }, ], }, ], }, ];
 */
const flattenTree = (data) => {
  var resp = [];
  flattenInfinite(data, 'children', [], resp);
  return resp;
};
```