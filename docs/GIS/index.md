# 常用

## arcgis-js-api 地址

| 来源   | 地址                                                    | 说明 |
| ------ | ------------------------------------------------------- | ---- |
| 8868   | http://www.ztgis.com:8868/arcgis_js_api/library/4.15    | -    |
| 本机   | http://g.com/esri/4.15                                  | -    |
| 第三方 | https://app.gdeei.cn/arcgis-js-api/library/4.14         | -    |
| 发布部署   | http://222.76.242.134/arcgis_js_api/library/3.32compact | -    |

## Token 申请地址

[http://222.76.242.138/arcgis/tokens/](http://222.76.242.138/arcgis/tokens/)

## 对原生 esri-arcgis-api-4.15 进行封装

https://github.com/Esri/esri-loader#examples

## 加载

`npm install --save esri-loader`

```ts
import { loadModules } from 'esri-loader';
loadScript({
  url: `${baseUrl}/init.js`,
  css: `${baseUrl}/esri/css/main.css`,
  dojoConfig: {
    async: true,
    locale: 'zh-cn',
    has: {
      'esri-native-promise': true,
    },
  },
});

// this will lazy load the ArcGIS API
// and then use Dojo's loader to require the classes
loadModules(['esri/views/MapView', 'esri/WebMap'])
  .then(([MapView, WebMap]) => {
    // then we load a web map from an id
    var webmap = new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: 'f2e9b762544945f390ca4ac3671cfa72',
      },
    });
    // and we show that map in a container w/ id #viewDiv
    var view = new MapView({
      map: webmap,
      container: 'viewDiv',
    });
  })
  .catch((err) => {
    // handle any errors
    console.error(err);
  });
```
