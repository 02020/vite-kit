<template>
  <div ref="viewDiv" class="viewDiv"></div>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="mb-2 p-1 rounded cursor-pointer bg-yellow-300" ref="app-click">ShapeLayer</div>

    <div class="flex flex-wrap" ref="app">
      <div
        class="m-1 p-1 rounded bg-gray-400 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>

    <div class="bg-blue-500 text-gray-200 p-2" ref="domMove">[被加载的内容domMove]</div>
    <div class="bg-blue-500 text-gray-200 p-2" ref="domClick">[被加载的内容domClick]</div>
  </div>
</template>

<script>
let gis, layer, simpleLayer, dataDemo, symbol
const layerAddShape = (layer, rings) => {
  for (let i = 0; i < 5; i++) {
    let attrs = {
      title: +new Date(),
      key: 'value2',
      id: 'v2', // 传入id
    }
    rings[0].forEach((x) => {
      x[0] += 0.003
    })

    // 增加到图层
    let g = layer.add({ rings }, attrs)
  }
}

export default {
  data() {
    return {
      logs: [],
      actionList: [
        { key: 'simple', title: '简单加载' },
        { key: 'addMany', title: '多个图形' },
        {
          key: 'delete2',
          title: '根据ID删除',
          fn: function () {
            simpleLayer.delete('v2')
          },
        },

        { key: 'dom', title: '加载图形(带dom)' },
        {
          key: 'delete',
          title: '根据ID删除',
          fn: function () {
            layer.delete('v2')
          },
        },
      ],
      gis: null,
    }
  },
  methods: {
    dom() {
      const symbol = gis.createSymbol(2, 'solid', '#f00', '#cfc')
      let rings = dataDemo.rings

      layer = gis.createShapeLayer('temp', symbol)

      // 增加鼠标事件弹窗
      layer.withClick('{title}', this.$refs.domClick)
      layer.withMove('{title}', this.$refs.domMove)
      layer.goTo()

      layerAddShape(layer, rings)
    },
    simple() {
      let rings = dataDemo.rings
      simpleLayer = gis.createShapeLayer('simple', symbol)
      simpleLayer.goTo()
      for (let i = 0; i < 5; i++) {
        rings[0].forEach((x) => {
          x[0] += 0.003
        })
        // 增加到图层
        simpleLayer.add({ rings: rings, id: 'v2' })
      }
    },

    addMany() {
      simpleLayer = gis.createShapeLayer('simple', symbol)
      simpleLayer.goTo()

      let geoList = []
      for (let i = 0; i < 5; i++) {
        let temp = dataDemo.rings[0].map((x) => {
          return [x[0] + 0.003 * i, x[1]]
        })
        geoList.push({ rings: [temp], id: 'v2' })
      }
      // 增加到图层
      simpleLayer.addMany(geoList)
    },

    onClick(item) {
      const target = this.actionList.find((x) => x.key == item.key)
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
  },
  mounted() {
    gis = this.GIS.init(this.$refs['viewDiv'])
    gis.once('init', () => {
      symbol = gis.createSymbol(2, 'solid', '#f00', '#cfc')
    })
    dataDemo = this.GIS.dataDemo
  },
}
</script>
