<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">测试模板</div>
    <div class="flex space-x-2">
      <div
        class="p-1 rounded bg-gray-300 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>
  </div>
  <div ref="popup"></div>
</template>

<script>
import { rings } from '../mock/points'

export default {
  name: 'Events',
  props: {
    msg: String,
  },
  data() {
    return {
      uid: '',
      actionList: [{ key: 'edit', title: '编辑图层' }],
    }
  },

  methods: {
    onClick(item) {
      this[item.key]()
    },
    edit() {
      gis
        .shape('shape')
        .withPoint(rings)
        .withSymbol('pickup')
        .withPopup('{SHAPE}', this.$refs['popup'])
        .build()
        .goTo()
        .open()
        .withClose((shape) => {
          shape.remove()
        })
    },
  },
  mounted() {},
}
</script>
 