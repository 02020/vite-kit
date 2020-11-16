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
    {{logs}}
  </div>

</template>
<script>
import GIS from './_init'
import { eventList } from './eventList'

export default {
  data () {
    return {
      logs: [],
      actionList: eventList,
      gis: null
    }
  },
  methods: {
    onClickTest (param) {
      this.logs.push("接收点击事件")
      console.log("接收点击事件", param)
      const point = param.mapPoint;
      const text = (+ new Date()).toString().substring(6, 10);
    },
    onClickOnly (param) {
      console.log("only", param)
    },
    onClickOnly2 (param) {
      console.log("only2")
    },
    onClick (item) {
      const target = this.actionList.find(x => x.key == item.key);
      this.logs.push(item.title)
      target.fn.apply(this)
    },

  },
  mounted () {
    this.gis = GIS(this.$refs['viewDiv']);

  }
}
</script>