# VitePress Playground

<gis-print />

<Code>
<<< docs\.vitepress\components\GIS\print.vue
</Code>


 
```ts
 
```

## 前端生成的参数，传给后端

`layoutOptions.customTextElements` 新增字段内容存放位置
```json
{
  "operationalLayers": [
    {
      "type": "WebTiledLayer",
      "urlTemplate": "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=993470e78cc4324e1023721f57b23640",
      "credits": "国家矢量地图服务",
      "subDomains": [
        "t0",
        "t1",
        "t2",
        "t3",
        "t4",
        "t5",
        "t6",
        "t7"
      ],
      "id": "COUNTRY_DLG01",
      "title": "Layer",
      "opacity": 1,
      "minScale": 0,
      "maxScale": 0
    },
    {
      "type": "WebTiledLayer",
      "urlTemplate": "http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=993470e78cc4324e1023721f57b23640",
      "credits": "国家矢量注记地图服务",
      "subDomains": [
        "t0",
        "t1",
        "t2",
        "t3",
        "t4",
        "t5",
        "t6",
        "t7"
      ],
      "id": "COUNTRY_DLG02",
      "title": "Layer",
      "opacity": 1,
      "minScale": 0,
      "maxScale": 0
    }
  ],
  "mapOptions": {
    "extent": {
      "spatialReference": {
        "wkid": 4326
      },
      "xmin": 117.95944719833567,
      "ymin": 24.5955440341926,
      "xmax": 118.14220367030076,
      "ymax": 24.70622316821791
    },
    "spatialReference": {
      "wkid": 4326
    },
    "showAttribution": true,
    "scale": 72142.9670553589
  },
  "exportOptions": {
    "dpi": 300,
    "outputSize": [
      null,
      null
    ]
  },
  "layoutOptions": {
    "titleText": "",
    "authorText": "",
    "customTextElements": {
      "layout": "a3-portrait",
      "format": "gif",
      "dpi": 300,
      "title": "标题",
      "templateId": "作者"
    },
    "scaleBarOptions": {},
    "legendOptions": {
      "operationalLayers": []
    }
  }
}
```