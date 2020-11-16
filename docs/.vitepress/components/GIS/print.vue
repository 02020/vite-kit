<template>
  <div ref="viewDiv" class="viewDiv"></div>
  <div class="flex flex-wrap space-y-2 space-x-2 mb-2 font-mono">
    <div></div>
    <div
      class="p-1 rounded bg-yellow-300 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >{{item.title}}</div>
  </div>

  <div class="flex space-x-1 p-1 rounded" v-show="logs.length" ref="logs">{{logs}}</div>
</template>
<script>
let gis,
  printTask = null

const actionList = [
  {
    key: 'clear',
    title: '清空日志',
    fn: function (ev) {
      this.logs.splice(0, this.logs.length)
    },
  },
  { key: 'init', title: '加载打印功能' },
  { key: 'preview', title: '预览' },
  { key: 'print', title: '打印' },
  { key: 'clearPrint', title: '清空' },
]

export default {
  data() {
    return {
      logs: [],
      actionList: actionList,
    }
  },
  methods: {
    onClick(item) {
      const target = this.actionList.find((x) => x.key == item.key)
      this.logs.push(item.title)
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
    clearPrint() {
      printTask.clear()
    },
    preview() {
      printTask.create({
        width: 28.2,
        height: 17.0782,
      })
      console.log(printTask.scale)
    },
    print() {
      const printParameters = {
        layout: 'a3-portrait',
        format: 'gif',
        dpi: 300,
        title: '标题',
        templateId: '作者',
      }

      printTask.printParams(printParameters, (resp) => {
        console.log(resp)
        this.logs.push(resp)
      })
    },
    init() {
      printTask = gis.printTask()
      console.log('初始化成功')
    },
  },
  mounted() {
    gis = this.GIS.init(this.$refs['viewDiv'])
  },
}
</script>