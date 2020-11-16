<template>
  <div class="bg-gray-100 md:p-1 rounded">
    <div class="flex flex-wrap">
      <div
        class="m-1 p-1 rounded cursor-pointer bg-yellow-300"
        @click="init"
      >{{title}}{{enable?"启用":"关闭" }}</div>
      <div
        class="m-1 p-1 rounded bg-gray-400 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>
  </div>
</template>

<script>
let printTask = null

export default {
  name: 'Print',
  props: {
    msg: String,
  },
  data() {
    return {
      title: '地图打印 ',
      enable: false,
      createList: [],
      actionList: [
        { key: 'preview', title: '预览' },
        { key: 'print', title: '打印' },
        { key: 'clear', title: '清空' },
      ],
    }
  },
  watch: {
    enable(val) {
      if (val) {
        console.log('Layer-加载')
      } else {
        console.log('Layer-未初始化')
      }
    },
  },
  methods: {
    onClick(item) {
      this[item.key]()
    },
    clear() {
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
      })
    },
    init() {
      printTask = gis.printTask()
      this.enable = !this.enable
    },
  },
  mounted() {},
}
</script>
 