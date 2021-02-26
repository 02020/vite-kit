<gis-symbol />
<Code>
 <<< docs\.vitepress\components\GIS\symbol.vue
</Code>

入参参考 css 的边框样式: 宽度、样式、颜色 `border:5px solid red;`
即：

1. 三个参数为：线=> 宽度、样式、颜色
2. 四个参数为：面=> 宽度、样式、颜色
3.

## 创建样式的方法

### 1.创建默认样式

```javascript
createSymbol('pickup');
createSymbol('default');
createSymbol(); // 随机样式
```

### 2.创建点样式 [符号库](http://www.ztgis.com:8868/arcgis_js_api/library/4.15/sdk/latest/guide/esri-icon-font/index.html)

```javascript
// 支持图片['.png', '.jpg', '.svg']
// 传入图片地址:'http://g.com/ui/user/1.png'
createSymbol(22, x); // 宽=高 url
createSymbol(12, 22, x); // 宽 高 url
// 传入字体库:['\ue652', '\ue61d', '\ue655', '\ue659', '\ue661']
createSymbol(22, x, '#7ec699');
const x = ['circle', 'diamond', 'cross', 'square', 'triangle', 'x'][0];
createSymbol(12, x, '#2e4e7e', '#7ec699');
// 传入图片地址
createSymbol({
  type: 'esriPMS',
  url: 'http://g.com/web/30-seconds.png',
  width: 128,
  height: 128,
  angle: 0,
  xoffset: 1,
  yoffset: 111,
});
```

### 3.创建线样式

size: 大小
style: text, 线宽样式
color: 颜色

```javascript
// 默认 solid实线
createSymbol(22, '#7ec699');

// 边框样式
const x = [
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
][0];

createSymbol(22, x, '#7ec699');
```

### 4.创建面样式

size: 大小
style: 样式
outcolor: 边框颜色
color: 填充颜色

```javascript
// 面样式: ["backward-diagonal","cross-cross","diagonal-cross",
// "forward-diagonal","horizontal","none","solid","vertical"]
const x = [
  'none',
  'solid',
  'backward-diagonal',
  'cross-cross',
  'diagonal-cross',
  'forward-diagonal',
  'horizontal',
  'vertical',
][0];
createSymbol(2, item, '#2e4e7e', '#c93756');
```

### 5.创建文字样式

```javascript
createSymbol(14, 'text', '#2e4e7e', '请输入文字内容');
```
