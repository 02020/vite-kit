<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div ref='domMove'
         class="mb-2 p-1 rounded cursor-pointer bg-yellow-300">{{name}}</div>

    <div class="flex flex-wrap"
         ref='domClick'>
      <div class=" m-1 p-1 rounded bg-gray-400  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="onClick(item)">{{item.title}}</div>

    </div>

  </div>

</template>

<script> 
import { ref, watchEffect } from 'vue';
import  { rings } from '../mock/points'
 
const actionList = [
  { key: 'init', title: '新增' },
  { key: 'batch', title: '多个' },
  { key: 'mouse', title: '移开事件' },
  { key: 'edit', title: '编辑' },
]

export default {
  name: 'ShapePopup',

  setup (props, { emit }) {
    const name = ref('ShapePopup')
    const domMove = ref(null)
    const domClick = ref(null)

    let shape

    let handle = {
      init: () => {
    
        shape = gis.shape("shape1")
          .withPoint(rings)
          .withPopup("{SHAPE}", domMove.value)
          .build()
          .goTo()
          .open()
        // .onMouseLeaveRemove()
      },
      mouse: () => {
        shape.withEvent("mouse-leave", (ev) => {
          // ev.layer.remove(ev)
          shape.goTo().open()
        })
      },

      batch: () => {
        for (let i = 1; i < 5; i++) {
          rings.geometry.rings[0].forEach(x => {
            x[0] += 0.0021
          })
          gis.shape("shape")
            .withPoint(rings)
            .build()
            .goTo()
            .withLeaveRemove()
        }
      },
      edit: () => {
        shape.withSketch("move").effect((ev) => {
          console.log(ev)
        });
      }
    }


    const onClick = (item) => {
      handle[item.key]()
    }

    return { name, onClick, actionList, domMove, domClick };
  }
}
</script>
 