## 函数


collectionHandlers
functionApply


## 对象



## 数组


## 对象判断

### 用对象字面量或Map替代Switch语句

```ts
// use object literal to find fruits by color
  const fruitColor = {
    red: ['apple', 'strawberry'],
    yellow: ['banana', 'pineapple'],
    purple: ['grape', 'plum']
  };

function printFruits(color) {
  return fruitColor[color] || [];
}
```

```ts
// use Map to find fruits by color
  const fruitColor = new Map()
    .set('red', ['apple', 'strawberry'])
    .set('yellow', ['banana', 'pineapple'])
    .set('purple', ['grape', 'plum']);

function printFruits(color) {
  return fruitColor.get(color) || [];
}
```