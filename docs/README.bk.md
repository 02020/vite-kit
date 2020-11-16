[toc]

# vite-esri
## 引用的资源

## tailwindcss

## 目录结构

core esri-api 核心, 封装 arcgis 的方法

- createLayer: 根据 入参 type 创建不同的图层 
- ...

app 组装所有代码, 暴露对外方法

bus 消息中间件

graphic 图形相关 

# API

## 方法

#### add

##### 增加图层

- 入参
  1. id 图层id
  2. type 图层类型:  graphics
  3. visible 显隐
  4. ~~图层顺序~~
- 

##### 增加图形

1. 入参
   1.  id 图层id
   2. oid 图形id
   3. type 类型: point, polyline, polygon, text
   4. Symbol 样式(包含文字)
   5. content 容器

#### delete

##### 删除图层

- id 图层id

##### 删除图形

1.  id 图层id
2. oid 图形id

#### draw

绘制图形 point, polyline, polygon, text



## Events

#### esri 事件捕捉

##### click

- 获取坐标
- 获取点击位置的图形
- 关闭事件分发

##### pointer-move

获取鼠标当前位置

##### double-click 

未应用

#### 其他通讯

业务内部调用 pubsub 作为全局的消息传递



## 类

### Shape

封装 原生的 点\线\面, 支持绘制时显示当前鼠标位置, 线和面的实时显示

#### EasyShape(待完成)

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

### EsriBus

消息传递