<template>
  <div class="flex space-x-1 bg-gray-100 md:p-1 rounded"
       title="事件">
    <div class="mb-1 p-1 rounded cursor-pointer bg-yellow-300"
         @click="init">hitTest 启用/关闭</div>
    <div class="flex  space-x-1">
      <div class="p-1 rounded bg-gray-300  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="click(item)">{{item.title}}</div>

    </div>
  </div>

</template>

<script>
let shape = null;

export default {
  name: 'EventsHitTest',
  props: {
    msg: String
  },
  data () {
    return {
      uid: "",
      actionList: [
        { key: "enable", title: "启用/关闭" },
        { key: "onLayer", title: "图层监听" },
        { key: "off", title: "取消监听" },
      ],

    }
  },

  methods: {
    click (item) {
      this[item.key]();
    },
    enable () {
      window.gis.hitTest = !window.gis.hitTest;
      console.log("hitTest", window.gis.hitTest)
    },
    off () {
      gis.off(this.onLayerClick)
    },
    onClick (ev, param) {
      console.log(ev)
      if (window.gis.hitTest) {
        return
      }
      const point = param.mapPoint;
      const text = (+ new Date()).toString().substring(6, 10);

    },
    onLayerClick (ev, resp) {
      console.log(resp)
    },
    onLayer () {
      window.gis.on("gis-click", "temp", this.onLayerClick)
    },
    init () {
      window.gis.add({
        id: "temp",
        type: "graphics"
      });

      window.gis.on("gis-click", "none", this.onClick);
      window.gis.on("gis-click", this.onClick);
      console.log("init")
    },

  },
  mounted () {

  },


}
</script>
<style>
.esri-map,
#map {
  height: 100%;
  width: 100%;
}
</style>