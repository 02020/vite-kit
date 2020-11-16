<gis-shapeLayer />
<Code>
<<< docs\.vitepress\components\GIS\shapeLayer.vue
</Code>

## 定义
1、具有可自定义弹窗，鼠标点击、鼠标移动时触发
2、可增加同类型的图形
3、可根据id删除指定的图形

## 构造函数
new ShapeLayer(id, symbol)

调用方式 gis.createShapeLayer(id,symbol)

### Parameter 入参
| 名称   | 类型   | 说明     | 示例 |
| ------ | ------ | -------- | ---- |
| id     | String | 图层ID   |      |
| symbol | Symbol | 图形样式 |      |


## 属性
| 名称      | 说明         | 类型       | 可选值 | 默认值 |
| --------- | ------------ | ---------- | ------ | ------ |
| graphics  | 所有图形     | Collection |
| highlight | 启用关闭高亮 | Boolean    |


## 方法
| 方法名    | 说明               | 入参                    |
| --------- | ------------------ | ----------------------- |
| add       | 增加图形           | [geometry,attrs,symbol] |
| addMany   | 增加多个图形       | geometryList            |
| update    | ?                  | -                       |
| delete    | 根据id删除图形     | 图形id()                |
| clear     | 清空图层           | -                       |
| active    | ？                 | -                       |
| withMove  | 添加鼠标经过时弹窗 | (关键字, 标题, DOM)     |
| withClick | 添加点击时弹窗     | (关键字, 标题, DOM)     |

 

 ## 事件列表
| 事件名称 |                 说明 |         回调参数          |
| -------- | -------------------: | :-----------------------: |
| effect   | 点击图形或经过图形时 | [类型, graphic, graphics] |



#### [Collection](http://192.168.3.91/esri/v415_sdk/latest/api-reference/esri-core-Collection.html)
add addMany removeAll remove


```javascript
const symbol = gis.createSymbol(2, 'solid', '#f00', '#cfc')
const layer = gis.createShapeLayer('temp', symbol)

//  id 于 geo格式数据同级，可以用来删除图形
layer.add(geo,"uid")
layer.add({ rings: rings, id: 'v2' })

// 面
const list = [{ rings:[], id:"uid" }]
// 线
const list = [{ paths:[], id:"uid" }]
// 点
const list = [{ x:"",y:"", id:"uid" }]

layer.addMany(list)
 
layer.delete("uid")


```