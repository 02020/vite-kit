<gis-shape />
<Code>
<<< docs\.vitepress\components\GIS\shape.vue
</Code>

## 构造函数

new Shape(id, priority)

### Parameter 入参

| 名称     | 类型   | 说明       | 示例 |
| -------- | ------ | ---------- | ---- |
| id       | String | 图层 ID    |      |
| priority | number | 图层优先级 |      |

## 属性

| 名称      | 说明         | 类型       | 可选值 | 默认值 |
| --------- | ------------ | ---------- | ------ | ------ |
| graphics  | 所有图形     | Collection | -      | -      |
| highlight | 启用关闭高亮 | Boolean    | -      | -      |

## 方法

| 方法名          | 说明                 | 入参                                |
| --------------- | -------------------- | ----------------------------------- |
| withPoint       | 图形 geometry        | -                                   |
| withSymbol      | 图形样式             | [详见](#根据图形类型配置默认样式)   |
| withTitle       | 标题(调用默认弹窗)   | string / {key}                      |
| withPopup       | 自定弹窗             | (标题, DOM)                         |
| withEvent       | 自定义事件，接入回调 | ['mouse-leave',]                    |
| withSketch      | 启用图形编辑         | ['reshape' , 'transform' , 'move' ] |
| withLeaveRemove | 鼠标移开删除图形     | -                                   |
| withClose       | 关闭弹窗，事件回调   | -                                   |
| open            | 打开 popup 弹窗      | -                                   |
| update          | 更新 geometry        | -                                   |
| remove          | 移除图形             | -                                   |
| removeAll       | 移除图层上的所有图形 | -                                   |
| build           | 增加到 Map           | -                                   |
| goTo            | 定位                 | -                                   |
| center          | 返回图形中心点       | -                                   |

## 事件列表

| 事件名称 |                 说明 |         回调参数          |
| -------- | -------------------: | :-----------------------: |
| effect   | 点击图形或经过图形时 | [类型, graphic, graphics] |

## 数据结构-点线面

```javascript
const geometry = {
    attributes: {},
    rings: [], // paths:[]  { x,y }
  },
  polyline = { paths: [] },
  polygon = { rings: [] },
  point = { x, y };
```

###

## 示例

### 弹窗 Dom

传入 dom

```javascript
const shape = gis
  .shape('shape1')
  .withPoint(geometry)
  //"我是标题：{SHAPE}" 表示数据来至attrs
  .withPopup('我是标题：{SHAPE}', this.$refs['DOM'])
  .build()
  .goTo()
  .open()
  .withClose((shape) => {
    shape.remove();
  });
```

### 弹窗标题

只显示标题数据来来源:attrs

```javascript
const shape = gis.shape('shape1').withTitle('标题:{title}').open();
```

### 鼠标事件

```javascript
// 增加鼠标移开事件
shape.withEvent('mouse-leave', (ev) => {
  // ev.layer.remove(ev)
  shape.goTo().open();
});
```

### 编辑

```ts
// 编辑图形->移动
shape.withSketch('move').effect((ev) => {
  console.log(ev);
});
```

### 根据图形类型配置默认样式

```ts
// 点
gis.shape('temp').withPoint({ x: 118.141, y: 24.45 }).withSymbol('default').goTo().build();
// 线
gis.shape('temp').withPoint({ rings }).withSymbol('default').goTo().build();
// 面
gis.shape('temp').withPoint({ paths }).withSymbol('default').goTo().build();
// 定位
gis.goTo('temp');
```

## 其他

### [Collection](http://192.168.3.91/esri/v415_sdk/latest/api-reference/esri-core-Collection.html)

add addMany removeAll remove

```ts
let shape = null;
let shapes = null;

export default {
  name: 'Shape',
  props: {},
  data() {
    return {
      title: 'Shape',
      enable: false,
      createList: [
        { key: 'point', title: '点' },
        { key: 'points', title: '多点' },
        { key: 'polyline', title: '线' },
        { key: 'polygon', title: '面' },
        { key: 'shapes', title: '多个' },
      ],
      actionList: [
        { key: 'add', title: '新增' },
        { key: 'delete', title: '删除' },
        { key: 'edit', title: '编辑' },
      ],
    };
  },
  watch: {
    enable(val) {
      if (val) {
        console.log('Shape-加载');
      } else {
        console.log('Shape-未初始化');
      }
    },
  },
  methods: {
    onClickCreate(item) {
      this[item.key]();
    },
    onClick(item) {
      this[item.key]();
    },
    enable() {
      gis.bus.hitTest = !gis.bus.hitTest;
      console.log('hitTest', gis.bus.hitTest);
    },
    points() {
      let x = 118.1354,
        y = 24.687,
        attrs = { title: 1 };
      Array.from(['circle', 'cross', 'diamond', 'square', 'triangle', 'x']).forEach((item) => {
        gis.shape().withSymbol(18, item, '#fffbe5', '#ffba00').withPoint({ x, y }).build();
        x += 0.002;
        attrs.title += 1;
      });
    },
    point() {
      gis
        .shape()
        .withPoint({
          x: 118.1354,
          y: 24.687,
        })
        .withSymbol(64, 'http://g.com/ui/user/1.png')
        .build()
        .goTo(12);
    },
    polygon() {
      let rings = [
        [
          [118.1354454882645, 24.66703265536293],
          [118.14659098675793, 24.66703265536293],
          [118.14659098675793, 24.65725891053022],
          [118.1354454882645, 24.65725891053022],
          [118.1354454882645, 24.66703265536293],
        ],
      ];
      Array.from([
        'none',
        'solid',
        'backward-diagonal',
        'cross-cross',
        'diagonal-cross',
        'forward-diagonal',
        'horizontal',
        'vertical',
      ]).forEach((item) => {
        gis
          .shape()
          .withSymbol(2, item, '#f00', '#cfc')
          .withPoint({
            rings,
          })
          .build();

        rings[0].forEach((x) => {
          x[0] += 0.016;
        });
      });
    },
    polyline() {
      let paths = [
        [
          [118.1354454882645, 24.67703265536293],
          [118.14659098675793, 24.67703265536293],
          [118.14659098675793, 24.66725891053022],
        ],
      ];
      Array.from([
        'solid',
        'dash',
        'dash-dot',
        'dot',
        'long-dash',
        'long-dash-dot',
        'long-dash-dot-dot',
        'none',
        'short-dash',
        'short-dash-dot',
        'short-dash-dot-dot',
        'short-dot',
      ]).forEach((item) => {
        gis
          .shape()
          .withSymbol(4, item, '#e10000')
          .withPoint({
            paths,
          })
          .build();

        paths[0].forEach((x) => {
          x[0] += 0.016;
        });
      });
    },

    delete() {
      shape.remove();
    },
    shapes() {
      let geoList = [],
        x = 118.1354454882645,
        y = 24.68703265536293;

      for (let i = 1; i < 5; i++) {
        x += 0.002;
        geoList.push({
          x,
          y,
        });
      }
      const symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00');
      shapes = gis.createShapes(geoList, symbol);
    },
    edit() {
      let shape = shapes.getItemAt(0);
      shapes.remove(shape);
    },
    add() {
      let x = 118.1354454882645,
        y = 24.67703265536293,
        symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00');
      let shape = gis.createShape(
        {
          x: x + 0.002,
          y,
        },
        symbol
      );
      shapes.add(shape.graphic);
    },

    init() {
      this.enable = !this.enable;
    },
  },

  mounted() {},
};
```
