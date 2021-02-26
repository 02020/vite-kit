<!-- @format -->

# 应用 API

## 构造函数

new GIS(properties?:any);

## 属性

| 名称      | 说明         | 类型       | 可选值 | 默认值 |
| --------- | ------------ | ---------- | ------ | ------ |
| graphics  | 所有图形     | Collection | -      | -      |
| highlight | 启用关闭高亮 | Boolean    | -      | -      |

## 方法

| 方法名              | 说明                 | 入参                                | 返回   |
| ------------------- | -------------------- | ----------------------------------- | ------ |
| initMapView         | 加载地图             | [详见](../GIS/A02-index.md)         | -      |
| initMenu            | 加载右键菜单         | [详见](#initMenu)                   | -      |
| initUI              | 加载 UI 组件         | -                                   | 已挂载 |
| add                 | 增加图层             | [](#add)                            | -      |
| addMany             | 增加多个图层         | -                                   | -      |
| delete              | 删除图层             | - /图形(未加入)                     | -      |
| update              | 修改图层相关属性     | [详见](#update)                     | -      |
| get                 | 根据图层 ID 获取图层 | -                                   | -      |
| getMany             | 根据图层组名         | -                                   | -      |
| createSymbol        | 创建符号             | [详见](../GIS/Symbol.md)            | -      |
| createSketch        | 绘制图形，可编辑     | [详见 ](../GIS/SketchLayer.md)      | -      |
| createShape         | 创建 Shape 图形      | [详见 ](../GIS/Shape.md)            | -      |
| shape               | createShape 的简写   | [详见 ](../GIS/Shape.md)            | -      |
| createShapeLayer    | 创建带事件的图层     | [详见 ](../GIS/C01.ShapeLayer.md)   | -      |
| printTask           | 打印服务             | [详见 ](../GIS/Print.md)            | -      |
| viewInfo            | 当前地图的相关信息   | -                                   | -      |
| goTo                | 定位                 | [详见 goTo](../GIS/goTo.md)         | -      |
| widthEditor         | 原生的服务编辑功能   | [详见 ](../GIS/C01.FeatureLayer.md) | -      |
| createShapeRenderer | Shape 文件上传解析   | [详见 ](../GIS/goTo.md)             | -      |
| withFontsUrl        | 配置本地字体路径     | [详见 ](#withFontsUrl)              | -      |

## 入参

### initMenu 右键菜单

```ts
const list = [
  {
    label: '编辑1',
    iconClass: 'dijitEditorIcon ion-ios-checkmark-outline',
    onClick: console.log,
  },
  {
    label: '编辑2',
    iconClass: 'dijitEditorIcon ion-ios-checkmark-outline',
    onClick: console.log,
  },
];
gis.initMenu(list);
```

### add 图层新增

```ts
// graphics
gis.add({ id: 'temp', type: 'graphics' });

// feature 编辑
const layerData = {
  id: 'edit',
  type: 'feature',
  url: 'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1',
};

gis.add(layerData).then((...args) => {
  editor = gis.widthEditor('edit', fieldConfig);
});
```

#### add 动态图层

```ts
gis.add({
  id: 'image01',
  url: 'http://222.76.242.138/arcgis/rest/services/ZTT/SPFLP/MapServer';,
  type: 'map-image',
  group: 'test',  //  一个图层只能属于一个组
});

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

### update 更新

一个图层只能属于一个组

```ts
// 修改图层顺次
gis.update([{ ids: 'red', reorder: 2 }]);
gis.update([
  { ids: 'white1', reorder: 2 },
  { ids: 'white', reorder: 1 },
]);

// 控制图层显隐
gis.update({ ids: theme.id, visible: true });
gis.update([
  { group: 'country,xm', exclude: [], visible: false },
  { ids: exclude, visible: true },
]);

const methods = {
  onChangeLayer(item) {
    const { id, checked, slider } = item;

    this.gis.update({ ids: id, visible: checked, opacity: slider / 100 });
  },
};
```

### withFontsUrl 字体路径配置

配置本地字体路径
`http://g.com/esri/fonts/`
`http://www.ztgis.com:8868/arcgis_js_api/fonts`

```ts
let emojis = ['🔥', '⏲️', '🏆', '🍉'];
```
