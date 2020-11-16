<gis-goTo /> 
<Code>
 <<< docs\.vitepress\components\GIS\goTo.vue
</Code>
 

```javascript
// 根据点坐标定位，平移
gis.goTo({ x: 118.135, y: 24.6770});
gis.goTo([118.155, 24.6770]);

// 根据点坐标定位，缩放
gis.goTo({ x: 118.135, y: 24.6770 }, 16);
gis.goTo([118.155, 24.6770], 15);

gis.goTo('118.135,24.6770', 16);

// 四至，缩放
gis.goTo('118.13,24.67,118.135,24.6770');

// 根据图层定位
gis.goTo('temp');

// 根据shape定位
let shape = gis.shape()
  .withPoint({ x: 118.1354454882645, y: 24.67703265536293, })
gis.goTo(shape, 15);


// shape 可直接调用
gis.shape()
  .withPoint({
    x: 118.1354454882645,
    y: 24.67703265536293,
  })
  .withSymbol(32, 'http://192.168.3.91/ui/user/1.png')
  .build()
  .goTo(14);

```