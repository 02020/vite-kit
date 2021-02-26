# 简单示例

## 示例代码-01

### 0101-入口文件

```ts
//gis 组件
import GIS from './GIS';
const gis = new GIS();
window.gis = gis;
Vue.prototype.gis = gis;
Vue.prototype.$bus = gis.bus;

GIS.initArcGisJsApi(process.env.VUE_APP_ESRI_API_URL).then(() => {
  gis.withFontsUrl(process.env.VUE_APP_ESRI_FONT_URL);
  appInit();
});
```

### 0102 组件中调用

```ts

```

## 示例代码-02

```ts

```

## 示例代码-03

```ts

```

## 示例代码-04

```ts

```

## 测试

```html
<template>
  <div @click="onClick">Click me!</div>
</template>

<script>
  export default {
    methods: {
      onClick: () => {
        window.alert(1);
      },
    },
  };
</script>
```
