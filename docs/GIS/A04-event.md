<gis-event /> 
<Code>
 <<< docs\.vitepress\components\GIS\event.vue
</Code>
 

图层加载先后顺次

`when > layerview-create > whenLayerView`

```ts
view.whenLayerView(layer).then(() => {
    console.log('whenLayerView');
});

layer.on('layerview-create', () => {
    console.log('layerview-create');
});

layer.when(() => {
    console.log('when');
});



```


## 事件列表
| 事件名称      |         说明 | 回调参数 |
| ------------- | -----------: | :------: |
| init          |   地图初始化 |    -     |
| click         |     点击事件 |    -     |
| drag          |     拖拽事件 |    -     |
| double-click  |     双击事件 |    -     |
| pointer-move  |     鼠标移动 |    -     |
| pointer-down  |     鼠标按下 |    -     |
| pointer-enter |      进入dom |    -     |
| pointer-leave |      离开dom |    -     |
| create        |     图层创建 |          |
| create-error  |     创建失败 |          |
| destroy       |     图层销毁 |          |
| change        |     地图改变 |          |
| zoom          |     地图缩放 |          |
| resize        | 改变窗口大小 |          |




## 事件方法调用
| 方法名称 | 说明                 |
| -------- | -------------------- |
| on       | 监听                 |
| once     | 执行一次             |
| off      | 取消监听             |
| toggle   | 切换/取消            |
| only     | 暂停其他，只监听自己 |


```javascript
gis.on('gis-click', onClick);  //监听点击事件，执行指定方法
gis.on("gis-click", "layerID", onClick)  // layerID 图层ID 

gis.off('gis-click', onClick); // 移除点击事件指定的方法
gis.off('gis-click')  // 移除所有点击事件

gis.toggle('gis-click', onClick, false);
gis.toggle('gis-click', onClick);
```

### only的使用
```javascript
//1、监听点击事件，执行指定方法
gis.on('gis-click', onClick);

//2、监听点击事件，只执行onClickOnly1的方法，关闭了其他的点击事件分发
gis.only('gis-click', onClickOnly1);

//3、只执行onClickOnly2的方法，不执行onClickOnly1 及 onClick 的方法
gis.only('gis-click', onClickOnly2);

//4、移除only2，则启用only1的事件方法
gis.off('gis-click', onClickOnly2);

//5、移除only1，则启用on监听的事件方法及onClick的方法
gis.off('gis-click', onClickOnly1);

```


## 示例代码
```javascript
let fn = (ev) => {
    let p = ev.__point;
    console.log(p.x, p.y);
};
gis.on('gis-pointer-move', debounce(fn, 100));
gis.once('gis-pointer-move', () => {
    console.log('once');
});
gis.on('gis-click', (ev) => { 
    console.log(ev.mapPoint.x ,ev.mapPoint.y); 
});
 
      // view.graphics.on("after-changes",(ev)=>{
      //   console.log(ev)
      // })
```


## 测试
 ```html
<template>
<div @click="onClick">Click me!</div>
</template>

<script>
export default {
    methods: {
        onClick: () => { window.alert(1) },
    },
}
</script>
 ```