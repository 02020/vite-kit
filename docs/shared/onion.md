# 函数

## 装箱

```ts
const Box = (x) => ({
  map: (f) => Box(f(x)),
  fold: (f) => f(x),
  toString: () => `Box(${x})`,
});

const LazyBox = (g) => ({
  map: (f) => LazyBox(() => f(g())),
  fold: (f) => f(g()),
});

```

## 示例

```ts

const res = Box(' 64')
  .map((s) => s.trim())
  .map(parseInt)
  .map((i) => i + 1)
  .fold((x) => x * 10);

const res2 = LazyBox(() => ' 64')
  .map((s) => s.trim())
  .map(parseInt)
  .map((i) => i + 1)
  .fold((x) => x * 10);

```

```ts

    let obj = { a: 1, b: 2,c:3 };
      Object.entries(obj).forEach(([key, value]) => {
        console.log(key, value);
      });
      let map = new Map(Object.entries(obj));

```
