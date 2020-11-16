<template>

  <div class="flex space-x-1 p-1 rounded">

    <div class="p-1  bg-gray-400  cursor-pointer"
         @click="onClickOn">{{textOn}}</div>

    <div class="p-1  bg-gray-400  cursor-pointer"
         @click="onClickOff">{{textOff}}</div>
  </div>

  <div ref='viewDiv'
       class="viewDiv"> </div>

</template>
<script>
import GIS from './_init'


export default {
  data () {
    return {
      textOn: "开启监听",
      textOff: "移除监听",
      gis: null
    }
  },
  methods: {
    onGIS (ev) {
      console.log("onGIS", ev)
    },
    onClickOn () {
      this.gis.on("gis-click", this.onGIS);
    },
    onClickOff () {
      this.gis.off("gis-click", this.onGIS)
    }
  },
  mounted () {
    this.gis = GIS(this.$refs['viewDiv']);

  }
}
</script>
 