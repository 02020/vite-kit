# 全局API
属性 / 方法
| 名称            | 说明                     | 类型 |
| --------------- | ------------------------ | ---- |
| initArcGisJsApi | 挂载在线的 arcgis-js-api | 方法 |
| help            | 打印（枚举内容...）      | 方法 |
| Index           | 枚举                     | 属性 |
| shared          | 常用函数及方法           | 属性 |



## 创建一个 GIS 实例
每个 GIS 应用都是通过用 GIS 函数创建一个新的 GIS 实例开始的
```ts
// 不传参
const gis = new GIS(properties?:any);

// 传参
const gis = new GIS({
  container: 'viewMap2000',
  tileInfo: true,
  zoom: 12,
  center: '118.06,24.444',
  wkid: 4490,
  country: 'DOM',
  widgets: {},
})
 
```

## 加载
### 方式一：实例化的时候入参
```ts
  // 加载API及相关模块
  GIS.initArcGisJsApi(baseUrl).then(init);
  const gis = new GIS();

  // 初始化地图
  gis.initMapView({}).then((gis)=>{
    console.log(gis)
  })

  gis.on("init",()=>{
    // 地图初始化完成
    // 执行相关操作 加载地图等
  })
```

### 方式二：实例化的时候入参
```ts

  const gis = new GIS(mapView92);

  // 挂载全局
  window.gis = gis;

  const init = () => {
    gis.once('init', (view) => {
      console.log('gis-init');

      gis.on('gis-click', (ev) => {
        console.log(ev.mapPoint.x, ev.mapPoint.y);
      });
      // gis.goTo([118.06, 24.444], 15);  // 鼓浪屿

      setTimeout(() => {}, 3000);
    });
  };

  let baseUrl = 'http://g.com/esri/4.15';
  // 加载API
  GIS.initArcGisJsApi(baseUrl).then(init);
```

<gis-init />

<Code>
 <<< docs\.vitepress\components\GIS\init.vue
</Code>

## 构造函数


### Parameter 入参
| 名称      | 类型           | 说明                   | 示例                                    |
| --------- | -------------- | ---------------------- | --------------------------------------- |
| container | HTMLDivElement | [id , node]            | ['viewMap2000' , this.$refs['viewDiv'], |
| country   | String         | [0, 'DLG','DOM','DEM'] | 0:不加载, 矢量 DLG, 影像 DOM ,晕眩 DEM  |
| layerList | Array[Object]  | -                      | -                                       |
| widgets   | Object         | esri自带组件           | 详见枚举 WidgetsIndex                   |
| center    | String         | 中心点                 | [ '55555,5000','118.06,24.444']         |
| zoom      | number         | 缩放级别               | [1,20]                                  |
| extent    | String         | 地图四至               | 启用后,zoom与center失效                 |
| wkid      | number         | 坐标系                 | [4326,4490]                             |
| wkt       | String         |                        | -                                       |
| tileInfo  | Object         | 地图加载层级           | -                                       |




### 入参示例
#### 加载国家与厦门底图配置
```ts
let init92 = {
  container: this.$refs['viewDiv'],
  zoom: 6,
  tileInfo: false,
  center: '55555,5000',  // 不起作用，需要手动定位
  extent: '36920.6636,-2179.8415,93151.5846,56361.4883',
  wkid: 4490,
  wkt: 'PROJCS["92xiamen",GEOGCS["GCS_Krasovsky_1940",DATUM["D_Krasovsky_1940",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",100000.0],PARAMETER["False_Northing",-2700000.0],PARAMETER["Central_Meridian",118.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
  widgets: {},
  layerList: xm92,
}

let init2000 = {
  Only_Country: {
    tileInfo: true,
    zoom: 14,
    center: '118.06,24.444',
    wkid: 4326, // 只加载国家的必须采用4326
    country: 'DOM',
  },
  No_Country: {
    tileInfo: true,
    zoom: 5,
    center: '118.06,24.444',
    wkid: 4490,
    country: 0, // 不加载国家的服务
    widgets: {},
    layerList: xm2000,
  },
  Country_XM: {
    tileInfo: true,
    zoom: 14,
    center: '118.06,24.444',
    wkid: 4490,
    country: 'DOM',
    layerList: xm2000,
  }
}

```
#### 数据对照
 厦门3级== 国家12级
| 加载类型  | zoom | wkid |
| --------- | ---- | ---- |
| 国家      | 14   | 4326 |
| 厦门      | 5    | 4490 |
| 国家+厦门 | 14   | 4490 |

 
厦门: zoom => 0 => 1154287.4728857423 => 地图服务 Level ID: 8 
 

            layers[i].setMinScale(1.4774879652937502E8);
            }else{
              layers[i].setMinScale(1127.2338602399827);


#### 关于入参的差异
初始化加载国家的底图服务时: zoom=[1,20]
若只加载厦门的: zoom=[1,10]


 
#### 注意事项
加载国家的地图服务必须使用 wkid 4326
 
[Zoom]()
[Locate]()
[NavigationToggle]()
[Compass]()
[Measurement]()
[Swipe]()
[TimeSlider]()
[ScaleBar]()
