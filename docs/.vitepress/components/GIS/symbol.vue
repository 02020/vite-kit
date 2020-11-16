<template>
  <div ref='viewDiv'
       class="viewDiv"> </div>
  <div class="flex space-x-1 p-1 rounded">

    <div class="p-1 rounded bg-gray-300  cursor-pointer"
         v-for="item in actionList"
         :key="item.key"
         @click="onClick(item)">{{item.title}}</div>
  </div>

  <div class="flex space-x-1 p-1 rounded">
    <div class="p-1 rounded bg-gray-300  cursor-pointer"
         v-for="item in createList"
         :key="item.key"
         @click="onClick(item)">{{item.title}}</div>
  </div>

  <div class="flex space-x-1 p-1 rounded"
       ref='logs'
       v-show='logs.length'>
    {{logs}}
  </div>

</template>
<script>
import GIS, { Index } from './_init'
import { geo, point, rings, paths  } from './data'

let gis = null

const createPolyline = (gis) => {
  const Style = Index.PolylineStyle;

  Object.keys(Style).forEach((x) => {
    let item = Style[x];
    console.log(item)
    gis.shape("shape")
      .withPoint({ paths })
      .withSymbol(2, item, '#2e4e7e')
      .build()


    paths[0].forEach((x) => {
      x[0] += 0.006;
    });
  });
};

const createPolygon = (gis) => {
  const Style = Index.PolygonStyle;

  Object.keys(Style).forEach((x) => {
    let item = Style[x];

    gis.shape("shape")
      .withPoint({ rings })
      .withSymbol(2, item, '#2e4e7e', '#c93756')
      .build()


    rings[0].forEach((x) => {
      x[0] += 0.006;
    });
  });
};

// 绘制点
const createPoint = (gis) => {
  const Style = Index.PointStyle;
  const x = point.x;
  Object.keys(Style).forEach((x) => {
    gis.shape("shape")
      .withPoint(point)
      .withSymbol(12, Style[x], '#2e4e7e', '#7ec699')
      .build()

    point.x += 0.001;
  });

  // 字体库的会延迟
  point.x = x;
  point.y += 0.004;
  Array.from(['\ue652', '\ue61d', '\ue655', '\ue659', '\ue661']).forEach(
    (x) => {
      gis.shape("shape")
        .withPoint(point)
        .withSymbol(22, x, '#7ec699')
        .build()

      point.x += 0.001;
    }
  );

};
const
  createList = [
    { key: 'init', title: '点线面', fn: function () { this.init() } },
    { key: 'point', title: '点', fn: function () { this.point() } },
    { key: 'text', title: '文字', fn: function () { this.text() } },
    { key: 'polyline', title: '线', fn: function () { this.polyline() } },
    { key: 'polygon', title: '面', fn: function () { this.polygon() } },
    { key: 'batch', title: '创建所有样式的点线面', fn: function () { this.batch() } },
    { key: 'color', title: '随机颜色', fn: function () { this.color() } },

  ],
  actionList = []

export default {
  data () {
    return {
      logs: [],
      createList: createList,
      actionList: actionList,
      shape: null,
      name: 'default'
    }
  },
  methods: {
    onClick (item) {
      const target = this.createList.find(x => x.key == item.key);
      target.fn.apply(this)
    },
    init () {
      this.name = "pickup";  // "default"
      this.point();
      this.polyline();
      this.polygon();
    },
    point () {
      gis.shape()
        .withPoint(point)
        .withSymbol(this.name)
        .build().goTo();
    },
    text () {
      let shape = gis.shape("shape")
        .withPoint(point)
        .withSymbol(24, "text", '#2e4e7e', '请输入文字内容')
        .build().goTo()

      console.log(shape)
    },
    polyline () {
      gis.shape()
        .withPoint({ paths })
        .withSymbol(this.name)
        .build().goTo()
    },
    polygon () {
      gis.shape()
        .withPoint({ rings })
        .withSymbol(this.name)
        .build().goTo()
    },
    batch () {
      createPolyline(gis);
      createPolygon(gis);
      createPoint(gis);
      gis.goTo("shape")
    },
    color () {
      for (let i = 1; i < 5; i++) {
        geo.geometry.rings[0].forEach(x => { x[0] += 0.0021 })
        gis.shape("shape")
          .withPoint(geo)
          .build()
          .goTo()
      }

    }


  },
  mounted () {
    gis = GIS(this.$refs['viewDiv']);

  }
}
</script>