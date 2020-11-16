[toc]

# vite-esri

### initArcGisJsApi  

arcgis-js-api  初始化

### initMapView 

地图加载


### add  增加图层

- gis.add({});

### delete 删除图层/图形

- gis.delete("layerId")  
- gis.delete("layerId","oid")

### update 修改图层

- gis.update({id:"layerId",....})

### createShape 创建图形

- const shape = gis.createShape("图层ID","图形类型")
- shape.vertices([]) //增加图形, 点集合
-- shape.add("图层ID") //增加到图层 --
- shape.createSymbol(); //创建样式

### getShape 获取图形/执行修改

- const  shape = gis.getShape("layerId", "oid")  // 返回Shape 类
- 类的方法 update({})
- 类的值的坐标
- 类的值的样式
- 类的值atts属性

### draw 绘制图形

(自带地图事件:点击、双击、移动)

 point, polyline, polygon, text

### on 事件监听

#### 地图事件

click、pointer-move、double-click 等

#### 图层监听

新增图层，删除图层，更新图层

#### 组件间的消息传递

### off 事件注销



### createSymbol 创建样式

## 属性

### d

#### hitTest  启用点击图形

#### isPopup 启用弹窗

#### layerList 当前加载图层

## 工具及方法

### getInfo 获取当前地图信息

当前四至、缩放比例、加载的图层(layIds)、

地图打印

## 类

### Shape

封装 原生的 点\线\面, 支持绘制时显示当前鼠标位置, 线和面的实时显示

#### EasyShape

构建简易的图形, 不具有实时功能

#### Symbol  

样式 Symbol 根据入参的不同返回不同的样式

入参数量

1. 一个参数: 调用默认的样式
   1. polygon,rectangle,fill,area
   2. polyline,line
   3. point
2. 两个参数: 默认线-dash
   1. 宽度
   2. 颜色
3. 三个参数: 文字, 其他样式的线
   1. size: 大小
   2. style: text, 线宽样式
   3. color: 颜色
   4. 线宽样式: "dash"|"dash-dot"|"dot"|"long-dash"|"long-dash-dot"|"long-dash-dot-dot"|"none"|"short-dash"|"short-dash-dot"|"short-dash-dot-dot"|"short-dot"|"solid"
4. 四个参数: 圆, 其他样式的线
   1. size: 大小
   2. style: "circle", "cross", "diamond", "square", "triangle", "x"
   3. color: 边框线的颜色(dash)
   4. fillColor: 填充的颜色

`属性函数可修改线宽默认样式`