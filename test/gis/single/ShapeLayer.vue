<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="mb-2 p-1 rounded cursor-pointer bg-yellow-300"
         ref='app-click'>ShapeLayer</div>

    <div class="flex flex-wrap"
         ref='app'>
      <div class=" m-1 p-1 rounded bg-gray-400  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="onClick(item)">{{item.title}}</div>

    </div>

    <div ref='domMove'>domMove</div>
    <div ref='domClick'>domClick</div>

  </div>

</template>

<script> 
import { ref, watchEffect } from 'vue';
import { __polygon } from '../ts'
import { points } from '../../mock/points'

const actionList = [
  { key: 'init', title: '加载图层' },
  { key: 'highlight', title: '高亮' },
  { key: 'popup', title: '弹窗' },
  { key: 'clear', title: '清除' },
  { key: 'delete', title: '删除第一个' },
]

export default {
  name: 'ShapeLayer',

  setup (props, content) {
    const domMove = ref(null)
    const domClick = ref(null)
    let i = 0
    let layer
    let handle = {
      init: () => {

        const x = ['circle', 'diamond', 'cross', 'square', 'triangle', 'x'][0]
        const symbol = gis.createSymbol(22, 'triangle', '#2e4e7e', '#7ec699')

        // const symbol = gis.createSymbol(2, 'solid', '#f00', '#cfc');
        layer = gis.createShapeLayer('temp', symbol);
        // __polygon(gis, layer);
        layer.addMany(points)
        i = points.length - 1
        layer.goTo();
      },
      delete () {
        layer.remove(points[i].id)
        i--;
      },
      popup: () => {
        layer = gis.createShapeLayer('temp');
        layer.withClick("{title}", domClick.value);
        layer.withMove("{title}", domMove.value);
         __polygon(gis, layer);
        layer.goTo();

      },
      highlight: () => {
        console.log(layer.highlight)
        layer.highlight = !layer.highlight
      },
      clear: () => {
        layer.clear();
      }
    }


    const onClick = (item) => {
      handle[item.key]()
    }

    return { onClick, actionList, domMove, domClick };
  }
}
</script>
 