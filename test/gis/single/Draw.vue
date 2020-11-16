<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">
      Draw
    </div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >
      {{ item.title }}
    </div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in createList"
      :key="item.key"
      @click="onClickCreate(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'

const createList = [
  { key: 'point', title: '点' },
  { key: 'multipoint', title: '多' },
  { key: 'polyline', title: '线' },
  { key: 'polygon', title: '面' },
  { key: 'circle', title: '圆' },
  { key: 'rectangle', title: '矩' },
]

const actionList = [{ key: 'go', title: '定位' }]

export default {
  name: 'Draw',

  setup(props) {
    let sketch = null

    let handle = {
      go: () => {
        let content = '118.15,24.49\r\n118.12,24.5\r\n118.16,24.46'

        let points = content
          .split('\r\n')
          .map((item) => {
            let [x, y] = item.split(',').map(parseFloat)
            return { x, y }
          })
          .filter((item) => !!item.x && !!item.y)

        gis.goTo(points)
      },
    }

    const init = () => {
      sketch = gis.createSketch({
        id: '__draw',
        polyline: gis.createSymbol(2, 'dot', '#cfc'),
        polygon: gis.createSymbol(2, 'horizontal', '#f00', '#cfc'),
      })
    }
    const onClick = (item) => {
      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {
      sketch.create(item.key)
    }

    return { init, onClick, actionList, createList, onClickCreate }
  },
}
</script>
 