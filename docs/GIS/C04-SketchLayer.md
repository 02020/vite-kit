<!-- @format -->

 <gis-sketchLayer />

<Code>
 <<< docs\.vitepress\components\GIS\C01.sketchLayer.vue
</Code>

### 构造函数

### 方法

| 方法名     | 说明                              | 入参                         |
| ---------- | --------------------------------- | ---------------------------- |
| add        | 增加图形                          | [geometry,attrs,symbol]      |
| addMany    | 增加多个图形                      | geometryList                 |
| update     | -                                 | -                            |
| create     | 创建图形                          | [详见](#create)              |
| activeTool | 编辑图形                          | -                            |
| delete     | 删除选中的图形                    | （如果只存在一个则直接删除） |
| redo       | 图形编辑的重做                    | -                            |
| undo       | 图形编辑的撤销                    | -                            |
| cancel     | 结束编辑或创建状态                | -                            |
| destroy    | 销毁 sketchVM                     | -                            |
| clear      | 清空图层                          | -                            |
| active     | ？                                | -                            |
| updateList | 当前编辑的图形/当前图层的所有图形 | -                            |
| withMove   | 添加鼠标经过时弹窗                | (关键字, 标题, DOM)          |
| withClick  | 添加点击时弹窗                    | (关键字, 标题, DOM)          |

### 事件列表

| 事件名称 |                 说明 |         回调参数          |
| -------- | -------------------: | :-----------------------: |
| complete |         图形创建完成 |             -             |
| effect   | 点击图形或经过图形时 | [类型, graphic, graphics] |

#### create
```ts

const createList = [
  { key: 'point', title: '点' },
  { key: 'multipoint', title: '多' },
  { key: 'polyline', title: '线' },
  { key: 'polygon', title: '面' },
  { key: 'circle', title: '圆' },
  { key: 'rectangle', title: '矩' },
]

sketch = gis.createSketch({ id: 'sk' });

sketch.create('polygon');

sketch.complete((graphic, geometry, type, event) => {
  console.log(graphic, geometry, type, event);
  //绘制成果后请求数据
  this.fetchAttrsData();
});
```

```ts

```
