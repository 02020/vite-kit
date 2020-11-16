## 常用格式

## 数据格式

[geometry](https://developers.arcgis.com/documentation/common-data-types/geometry-objects.htm)
[symbol](https://developers.arcgis.com/documentation/common-data-types/symbol-objects.htm)
 
 [feature](https://developers.arcgis.com/documentation/common-data-types/feature-object.htm)


<<< docs\.vitepress\components\GIS\data.js

## JSON 格式的数据
```javascript
const graphicsJSON = {
  // 点
  point: {
    geometry: {
      spatialReference: { wkid: 4326 },
      x: 118.18405700861668,
      y: 24.676003840117385,
    },
    symbol: {
      type: 'esriSMS',
      color: [255, 255, 255, 255],
      angle: 0,
      xoffset: 0,
      yoffset: 0,
      size: 6,
      style: 'esriSMSCircle',
      outline: {
        type: 'esriSLS',
        color: [50, 50, 50, 255],
        width: 1,
        style: 'esriSLSSolid',
      },
    },
    attributes: {},
  },

  //  线
  paths: {
    geometry: {
      spatialReference: { wkid: 4326 },
      paths: [
        [
          [118.16382364212089, 24.639995306523204],
          [118.19245899978864, 24.659542796188617],
          [118.19365928424179, 24.642395875429482],
        ],
      ],
    },
    symbol: {
      type: 'esriSLS',
      color: [130, 130, 130, 255],
      width: 2,
      style: 'esriSLSSolid',
    },
    attributes: {},
  },

  //  面
  rings: {
    geometry: {
      spatialReference: { wkid: 4326 },
      rings: [
        [
          [118.1085248226721, 24.652426824073558],
          [118.13133022728172, 24.652426824073558],
          [118.13133022728172, 24.63082170391705],
          [118.1085248226721, 24.63082170391705],
          [118.1085248226721, 24.652426824073558],
        ],
      ],
    },
    symbol: {
      type: 'esriSFS',
      color: [150, 150, 150, 51],
      outline: {
        type: 'esriSLS',
        color: [50, 50, 50, 255],
        width: 2,
        style: 'esriSLSSolid',
      },
      style: 'esriSFSSolid',
    },
    attributes: {},
    popupTemplate: null,
  },
};
```


```javascript
const geometryJSON = '[{"spatialReference":{"wkid":4326},"rings":[[[118.1354454882645,24.67703265536293],[118.14659098675793,24.67703265536293],[118.14659098675793,24.66725891053022],[118.1354454882645,24.66725891053022],[118.1354454882645,24.67703265536293]]]},{"spatialReference":{"wkid":4326},"rings":[[[118.16373790751706,24.6775470629857],[118.1712825526511,24.6775470629857],[118.1712825526511,24.67068829468205],[118.16373790751706,24.67068829468205],[118.16373790751706,24.6775470629857]]]},{"spatialReference":{"wkid":4326},"rings":[[[118.16373790751706,24.6775470629857],[118.1712825526511,24.6775470629857],[118.1712825526511,24.67068829468205],[118.16373790751706,24.67068829468205],[118.16373790751706,24.6775470629857]]]},{"spatialReference":{"wkid":4326},"rings":[[[118.17368312155736,24.66211483430248],[118.18431421242802,24.66211483430248],[118.18431421242802,24.650626397393864],[118.17368312155736,24.650626397393864],[118.17368312155736,24.66211483430248]]]},{"spatialReference":{"wkid":4326},"rings":[[[118.17368312155736,24.66211483430248],[118.18431421242802,24.66211483430248],[118.18431421242802,24.650626397393864],[118.17368312155736,24.650626397393864],[118.17368312155736,24.66211483430248]]]}]'
const graphicsJSON = '[{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.1085248226721,24.652426824073558],[118.13133022728172,24.652426824073558],[118.13133022728172,24.63082170391705],[118.1085248226721,24.63082170391705],[118.1085248226721,24.652426824073558]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null},{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.1627090922706,24.699066448538286],[118.18379980480434,24.699066448538286],[118.18379980480434,24.68071924332599],[118.1627090922706,24.68071924332599],[118.1627090922706,24.699066448538286]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null},{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.18517155846583,24.67368900581488],[118.20626227099956,24.67368900581488],[118.20626227099956,24.65534180060261],[118.18517155846583,24.65534180060261],[118.18517155846583,24.67368900581488]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null},{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.13527401905671,24.685863319553853],[118.15156359377801,24.685863319553853],[118.15156359377801,24.675575167098383],[118.13527401905671,24.675575167098383],[118.13527401905671,24.685863319553853]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null},{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.12087060561852,24.670259621663057],[118.13716018033969,24.670259621663057],[118.13716018033969,24.659971469207584],[118.12087060561852,24.659971469207584],[118.12087060561852,24.670259621663057]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null},{"geometry":{"spatialReference":{"wkid":4326},"rings":[[[118.14847714804147,24.649683316752082],[118.17128255265109,24.649683316752082],[118.17128255265109,24.628078196595574],[118.14847714804147,24.628078196595574],[118.14847714804147,24.649683316752082]]]},"symbol":{"type":"esriSFS","color":[150,150,150,51],"outline":{"type":"esriSLS","color":[50,50,50,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{},"popupTemplate":null}]'
 
```