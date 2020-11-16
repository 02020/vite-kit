# R demo

## 数据

```ts
// 入参
const keyList = [
  // id, name
  ['TOOL_SQ', '拾取'],
  ['TOOL_HZ', '绘制'],
  ['TOOL_SC', '上传'],
  ['TOOL_QC', '清除'],
  ['TOOL_QT', '全图'],
];
```

## 将嵌套数组转为一个对象

```ts
let resp = null;
resp = R.fromPairs(CONST);

// 结果
[{ TOOL_SQ: '拾取' }, { TOOL_HZ: '绘制' }];
```

## 将数组转换成对象

```ts
let resp = null;
resp = R.map(R.zipObj(['id', 'name']))(keyList);

// 结果
resp = [
  { id: 'TOOL_SQ', name: '拾取' },
  { id: 'TOOL_HZ', name: '绘制' },
  { id: 'TOOL_SC', name: '上传' },
  { id: 'TOOL_QC', name: '清除' },
  { id: 'TOOL_QT', name: '全图' },
];
```
