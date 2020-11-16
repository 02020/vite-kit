<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">标绘</div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >{{item.title}}</div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in createList"
      :key="item.key"
      @click="onClickCreate(item)"
    >{{item.title}}</div>

    <div class="absolute bg-gray-200" style="top:100px;left:0px;" v-show="visible">
      <div ref="domPoint">domPoint</div>
      <div ref="domPolyline">domPolyline</div>
      <div ref="domPolygon">domPolygon</div>
      <div ref="domText">
        <span @click="onClickSave">保存</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, reactive, toRefs } from 'vue'

const createList = [
  { key: 'point', title: '点' },
  { key: 'polyline', title: '线' },
  { key: 'polygon', title: '面' },
  { key: 'text', title: '文字' },
]

const actionList = [{ key: 'm', title: '量测' }]

let sketch = null

export default {
  name: 'Demo',
  components: {},
  setup(props, { emit }) {
    const product = reactive({
      firstName: 'First Product',
      firstPrice: 10,
      firstQuantity: 1,
    })
    const domPoint = ref(null)
    const domPolyline = ref(null)
    const domPolygon = ref(null)
    const domText = ref(null)
    const visible = ref(false)
    let graphic = null
    let handle = {
      m: () => {
        const m = gis.widgets.Measurement
        m.activeTool = 'area'
      },
    }

    const init = () => {
      sketch = gis.createSketch({
        id: 'sk',
        point: gis.createSymbol(32, 'http://g.com/ui/user/1.png'),
        polygon: gis.createSymbol(2, 'horizontal', '#f00', '#cfc'),
      })
      sketch
        .withClick('point', '点标绘', domPoint.value)
        .withClick('polyline', '线标绘', domPolyline.value)
        .withClick('polygon', '面标绘', domPolygon.value)
        .withClick('text', '文字', domText.value)
        .effect((ev) => {
          console.log(ev)

          graphic = ev[0].graphic

          // if (graphic.attributes.__form && graphic.attributes.__form.firstName) {
          //   product.firstName = graphic.attributes.__form.firstName
          // }
        })
    }
    const onClick = (item) => {
      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {
      sketch.create(item.key)
    }

    const onClickSave = () => {
      graphic.attributes.__form = {
        ...toRefs(product),
      }
      console.log(graphic.attributes)
    }

    return {
      init,
      ...toRefs(product),
      onClick,
      onClickCreate,
      onClickSave,
      actionList,
      createList,
      domPoint,
      domPolyline,
      domPolygon,
      domText,
      visible,
    }
  },
}
</script>
 