<template>
<div class="flex space-x-1 p-1 rounded">
  <div class="p-1 rounded bg-gray-300  cursor-pointer" v-for="item in actionList" :key="item.key" @click="onClick(item)">{{item.title}}</div>
</div>
<div ref='viewDiv' class="viewDiv"> </div>
<div class="m-2">
  <span class="p-1 rounded bg-yellow-300">token申请地址</span>
  http://222.76.242.138/arcgis/tokens/
</div>
<div class="flex space-x-1 p-1 rounded">
  {{logs}}
</div>
</template>

<script>
import GIS from '../../GIS'
const xm92 = [{
      layerName: '厦门市2019年DOM',
      url: 'http://222.76.242.138/arcgis/rest/services/XM92/DEM_CVA/MapServer',
      layerType: 'DOM',
      type: 'tile',
      layerDefinitions: null,
      scaleEnabled: null,
      scaleMax: null,
      scaleMin: null,
      isTagLayer: '0',
      opacity: null,
      isDefault: '1',
      publishYear: '2019',
    },
    {
      type: 'feature',
      url: 'http://222.76.242.138/arcgis/rest/services/XM92/XZQH/MapServer/0',
    },
  ],
  xm2000 = [{
    token: "ROmOxhtKHwJwe9IaJ45wsAtm85opBaZunyUfgI_SRGW7E03IUDYDSMslMP2e1sUB",
    layerName: '厦门市2019年DOM',
    url: 'http://222.76.242.138/arcgis/rest/services/DOM2019/MapServer',
    layerType: 'DOM',
    type: 'tile',
    layerDefinitions: null,
    scaleEnabled: null,
    scaleMax: null,
    scaleMin: null,
    isTagLayer: '0',
    opacity: null,
    isDefault: '1',
    publishYear: '2019',
  }]

let gis = null;

const actionList = [{
    key: 'clear',
    title: '清空日志',
    fn: function (ev) {
      this.logs.splice(0, this.logs.length);
    },
  }, {
    key: "init92",
    title: "92坐标系",
  }, {
    key: "init2000",
    title: "2000坐标系",
  }, {
    key: 'init2000_No_Country',
    title: "2000坐标系-只加载厦门",
  }, {
    key: 'init2000_Only_Country',
    title: "2000坐标系-只加载国家",
  }

]

export default {
  data() {
    return {
      logs: [],
      actionList: actionList,
      gis: null
    }
  },
  methods: {
    onClick(item) {
      const target = this.actionList.find(x => x.key == item.key);
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
    init92() {
      let mapView92 = {
        container: this.$refs['viewDiv'],
        zoom: 6,
        tileInfo: false,
        center: '55555,5000',
        extent: '36920.6636,-2179.8415,93151.5846,56361.4883',
        wkid: 4490,
        wkt: 'PROJCS["92xiamen",GEOGCS["GCS_Krasovsky_1940",DATUM["D_Krasovsky_1940",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",100000.0],PARAMETER["False_Northing",-2700000.0],PARAMETER["Central_Meridian",118.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
        widgets: {},
        layerList: xm92,
      };
      this.init(mapView92)

      // 92 必须使用手动定位
      gis.once('init', (view) => {
        setTimeout(() => {
          gis.goTo('55555,5000', 5)
        }, 2000)
      })

    },
    init2000() {
      let mapView2000 = {
        container: this.$refs['viewDiv'],
        tileInfo: true,
        zoom: 14,
        center: '118.06,24.444', // 不执行定位
        wkid: 4490, // 
        country: 'DOM',
        widgets: {},
        layerList: xm2000,
      };
      this.init(mapView2000)
    },
    init2000_Only_Country() {
      this.init({
        container: this.$refs['viewDiv'],
        tileInfo: true,
        zoom: 14,
        center: '118.06,24.444',
        wkid: 4326, // 只加载国家的必须采用4326
        country: 'DOM',

      })
    },
    init2000_No_Country() {
      this.init({
        container: this.$refs['viewDiv'],
        tileInfo: true,
        zoom: 5,
        center: '118.06,24.444',
        wkid: 4490,
        country: 0, // 不加载国家的服务
        widgets: {},
        layerList: xm2000,
      })
    },
    init(mapView) {
      let baseUrl = 'http://www.ztgis.com:8868/arcgis_js_api/library/4.15';

      // this.logs.push("执行加载API")
      GIS.initArcGisJsApi(baseUrl).then((a) => {

        // this.logs.push("API加载完成")
        // this.logs.push("挂载[viewDiv]，加载地图")

        gis.initMapView(mapView).then((me) => {
          // this.logs.push("地图加载完成")
        });

      });
      let init2000 = {
        Only_Country: {
          tileInfo: true,
          zoom: 14,
          center: '118.06,24.444',
          wkid: 4326, // 只加载国家的必须采用4326
          country: 'DOM',
        },
        No_Country: {
          tileInfo: true,
          zoom: 5,
          center: '118.06,24.444',
          wkid: 4490,
          country: 0, // 不加载国家的服务
          widgets: {},
          layerList: xm2000,
        },
        Country_XM: {
          tileInfo: true,
          zoom: 14,
          center: '118.06,24.444',
          wkid: 4490,
          country: 'DOM',
          layerList: xm2000,
        }
      }

    },

  },
  mounted() {

    gis = new GIS();

    gis.on('init', (view) => {
      this.logs.push("接收地图初始化完成事件：" + view.center)
      // console.log(view.center);
      // gis.shape()
      //   .withPoint(view.center)
      //   .withSymbol(64, "http://g.com/ui/user/1.png")
      //   .build()

    });

  }
}
</script>
