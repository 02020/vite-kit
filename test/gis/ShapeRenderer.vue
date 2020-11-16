<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">测试模板</div>
    <div class="flex flex-wrap space-x-2 space-y-2">
      <div
        class="p-1 rounded bg-gray-300 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>
  </div>
</template>

<script>
import list from '../mock/render'
import rendererJSON from '../mock/rendererJSON'
let renderer, symbol2

export default {
  name: 'Events',
  props: {
    msg: String,
  },
  data() {
    return {
      uid: '',
      actionList: [
        { key: 'edit', title: '编辑图层' },
        { key: 'update', title: '更新' },
        { key: 'clear', title: '清空' },
        { key: 'json', title: 'rendererJSON' },
        { key: 'info', title: '信息' },

        { key: 'goTo', title: '定位' },
      ],
    }
  },

  methods: {
    onClick(item) {
      this[item.key]()
    },
    edit() {
      let symbol = gis.createSymbol(2, 'solid', '#2e4efe', '#c93756')
      let symbol2 = gis.createSymbol(2, 'solid', '#22eeee', '#c93756')
      let defaultSymbol = gis.createSymbol(
        1,
        'backward-diagonal',
        '#2e4eee',
        '#c93756'
      )

      renderer = gis.createShapeRenderer()
      renderer
        .withSource(list)
        .withSymbol(defaultSymbol)
        .withName('MC')
        .withPopup('{MC}')
        .withLabel('HAZZ', {
          color: '#c94356',
          size: 22,
          family: '微软雅黑',
          style: 'italic',
        })
        .withRenderer('刘五店港口区', symbol)
        .build()
    },

    update() {
      let symbol = gis.createSymbol(2, 'diagonal-cross', '#2e4efe', '#c93356')
      let symbol2 = gis.createSymbol(2, 'solid', '#2e4efe', '#c93356')
      let values = [
        { value: '东渡港口区', symbol: symbol },
        { value: '排头港口区', symbol: symbol2 },
      ]

      renderer
        .withSymbol(1, 'cross-cross', '#2e4efe', '#c93756')
        .withRenderer(values)
        .update()
    },
    json() {
      renderer = gis.renderer(rendererJSON).withSource(list).build()
    },
    goTo() {
      // renderer.goTo()
      let values = renderer.getValuesFromField('MC')
      // .filter(x => {
      //   return x.value.indexOf(this.search.value) > -1
      // })
      console.log('values', values)
      renderer.goTo(1)
    },
    clear() {
      // renderer.remove('东渡港口区').withOpacity(80)
      let s = gis
        .createColor({
          r: 125,
          g: 255,
          b: 13,
          a: 0.3, // Optional
        })
        
      console.log(s)
      console.log(s.toJSON())
      console.log(s.toRgb())
      console.log('rgba('+ s.toRgba().join(",")+')')
      //  'rgba(25, 190,107, .5)'
    },

    info() {
      // print(renderer.info())
      console.log(renderer.info())
    },
  },

  beforeCreate() {
    gis.on('init', () => {
      console.log('symbol2')
      symbol2 = gis.createSymbol(2, 'solid', '#2e4eee', '#c93756')
      this.edit()
    })
  },
}
</script>
 