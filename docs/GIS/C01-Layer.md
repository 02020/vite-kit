<!-- @format -->

# 图层类型

| 名称 | 图形类型        | esri/layers/        | 示例                  |
| ---- | --------------- | ------------------- | --------------------- |
| 要素 | feature         | FeatureLayer        |                       |
|      | graphics        | GraphicsLayer       |                       |
| 切片 | tile            | TileLayer           |                       |
|      | web-tile        | WebTileLayer        |                       |
|      | elevation       | ElevationLayer      |                       |
|      | imagery         | ImageryLayer        |                       |
|      | integrated-mesh | IntegratedMeshLayer |                       |
| 动态 | map-image       | MapImageLayer       | [详见](#动态地图服务) |
|      | map-notes       | MapNotesLayer       |                       |
|      | point-cloud     | PointCloudLayer     |                       |
|      | scene           | SceneLayer          |                       |
|      | stream          | StreamLayer         |                       |
|      | vector-tile     | VectorTileLayer     |                       |
|      | bing-maps       | BingMapsLayer       |                       |
|      | csv             | CSVLayer            |                       |
|      | georss          | GeoRSSLayer         |                       |
|      | group           | GroupLayer          |                       |
|      | kml             | KMLLayer            |                       |
|      | open-street-map | OpenStreetMapLayer  |                       |
|      | wms             | WMSLayer            |                       |
|      | wmts            | WMTSLayer           |                       |

exaggerated-elevation => beginor/ExaggeratedElevationLayer

## Code 代码

### 动态地图服务

#### 入参

```ts
var param = {
  type: 'map-image',
  url:
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
  sublayers: [
    { id: 10, renderer: { type: 'class-breaks' }, source: { mapLayerId: 1 } },
    {
      id: 11,
      renderer: { type: 'unique-value' },
      definitionExpression: 'POP07_SQMI >= 5100',
      source: { mapLayerId: 1 },
    },
    {
      id: 12,
      renderer: { type: 'simple' },
      definitionExpression: 'POP07_SQMI >= 5100',
      source: { mapLayerId: 1 },
    },
  ],
};
```

#### 原生的加载方式

```ts
var layer = new MapImageLayer({
  url:
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
  sublayers: [
    { id: 3, visible: false },
    { id: 2, visible: true },
    { id: 1, visible: true },
    { id: 0, visible: true, definitionExpression: 'pop2000 > 100000' },
  ],
});
```

#### gis 方式

```ts
// 接图表的地图服务存在问题, 只能控制一个图层的显示
gis.add({
  id: '接图表',
  url: 'http://222.76.242.138/arcgis/rest/services/Metadata/JTB_ALL/MapServer',
  type: 'map-image',
  sublayers: [
    { visible: true, id: 0 },
    { visible: true, id: 1, definitionExpression: 'object > 0' },
  ],
  token: '',
});
```

### 其他

```ts
// 图层排序
const reorder = (view) => (id: string, index: number) => {
  const layer = view.map.findLayerById(id);
  view.map.layer.reorder(layer, index);
};
const reorders = (view) => (arr: Array<any>) => {
  const __reorder = reorder(view);
  arr.forEach((x) => {
    __reorder(x.id, x.index);
  });
};

export { reorder, reorders };
```

## 暂存 URL

[控制点](http://222.76.242.138/arcgis/rest/services/Metadata/KZD/MapServer/0)

[editor](http://g.com/esri/v415_sdk/latest/sample-code/widgets-editor-configurable/live/index.html)

[popup-demo](http://g.com/esri/v415_sdk/latest/sample-code/popuptemplate-function/live/index.html)

[popup-demo](https://developers.arcgis.com/documentation/common-data-types/feature-object.htm)

[popup-demo](D:\Fr\www\esri\v415_sdk\latest\sample-code\popup-editaction\live\index.html)

[服务-编辑](http://www.ztgis.com:6080/arcgis/rest/services/fs_edit/fs_edit_cgcs2000/FeatureServer)

[服务-编辑](http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer)

[](http://g.com/esri/v415_sdk/latest/sample-code/widgets-editor-configurable/live/index.html)

[](http://g.com/esri/v415_sdk/latest/sample-code/popuptemplate-function/live/index.html)

[](https://developers.arcgis.com/documentation/common-data-types/feature-object.htm)

[](D:\Fr\www\esri\v415_sdk\latest\sample-code\popup-editaction\live\index.html)

[](http://www.ztgis.com:6080/arcgis/rest/services/fs_edit/fs_edit_cgcs2000/FeatureServer)

[](http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer)

```ts
const reorder = (view) => (id: string, index: number) => {
  const layer = view.map.findLayerById(id);
  view.map.layer.reorder(layer, index);
};
const reorders = (view) => (arr: Array<any>) => {
  const __reorder = reorder(view);
  arr.forEach((x) => {
    __reorder(x.id, x.index);
  });
};

export { reorder, reorders };
```
