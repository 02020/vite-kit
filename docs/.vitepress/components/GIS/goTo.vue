<template>
  <div ref='viewDiv'
       class="viewDiv"> </div>
  <div class="flex flex-wrap space-y-2 space-x-2  mb-2 font-mono">
    <div></div>
    <div class="p-1 rounded bg-yellow-300  cursor-pointer"
         v-for="item in actionList"
         :key="item.key"
         @click="onClick(item)">{{item.title}}</div>
  </div>

  <div class="flex space-x-1 p-1 rounded"
       v-show="logs.length"
       ref='logs'>
    {{logs}}
  </div>

</template>
<script> 

let gis, dataDemo

const
  actionList = [
    {
      key: 'clear', title: '清空日志',
      fn: function (ev) { this.logs.splice(0, this.logs.length); },
    },
    {
      key: "string", title: "string",
      fn: function () {
        gis.goTo('118.135, 24.6770', 16);
      }
    },
     {
      key: "extent", title: "extent",
      fn: function () {
        gis.goTo('118.13, 24.67,118.135, 24.6770');
      }
    },
    {
      key: "xy", title: "xy",
      fn: function () {
        gis.goTo({ x: 118.135, y: 24.6770, }, 16);
      }
    },
    {
      key: "array", title: "数组",
      fn: function () {
        gis.goTo([118.1554454882645, 24.67703265536293], 15);
      }
    },
    {
      key: "id", title: "图层ID",
      fn: function () {
        gis.goTo('temp');
      }
    },
    {
      key: "mouse", title: "shape1", fn: function () {

        gis.shape()
          .withPoint({
            x: 118.1354454882645,
            y: 24.67703265536293,
          })
          .withSymbol(32, 'http://192.168.3.91/ui/user/1.png')
          .build()
          .goTo(14);
      }
    },
    {
      key: "shape2", title: "shape2", fn: function () {
        const symbol = gis.createSymbol(32, 'http://192.168.3.91/ui/user/1.png');

        let shape = gis.shape()
          .withPoint({ x: 118.1354454882645, y: 24.67703265536293, })

        gis.goTo(shape, 15);
      }
    },
  ];


export default {
  data () {
    return {
      logs: [],
      createList: [],
      actionList: actionList,
      gis: null,
      shape: null
    }
  },
  methods: {
    onClick (item) {
      this.logs.push(item.title)
      const target = this.actionList.find(x => x.key == item.key);
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
    init () {
      shape = this.gis.shape("shape1")
        .withPoint(geo)
        .build()
        .goTo()

    },
  },
  mounted () {
    dataDemo = this.GIS.dataDemo
    console.log(dataDemo);
    gis = this.GIS.init(this.$refs['viewDiv']);
  }
}
</script>