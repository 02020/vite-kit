<template>
  <div class="flex flex-row space-y-1  text-center rounded bg-gray-200 m-2"
       v-for="(items,key) in indexList"
       :key="key">

    <div class="flex  flex-wrap  bg-blu-200">
      <div class="text-center font-medium text-yellow-100 bg-blue-600 px-4 py-2 m-2"> {{key}}</div>
      <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2"
           v-for="item in items"
           :key="item">
        {{item}}
      </div>

    </div>

  </div>

</template>
<script>
//  枚举
import GIS, { Index } from './_init'

export default {
  data () {
    return {
      indexList: {},
      actionList: [],
    }
  },
  methods: {
    onClick (item) {
      const target = this.createList.find(x => x.key == item.key);
      target.fn.apply(this)
    },
    init () {
      var indexList = {}
      Object.keys(Index).forEach((key) => {
        indexList[key] = []
        Object.keys(Index[key]).forEach((x) => {

          indexList[key].push(Index[key][x])
        })
      });

      this.indexList = indexList;
    },
  },
  mounted () {

    this.init()
  }
}
</script>