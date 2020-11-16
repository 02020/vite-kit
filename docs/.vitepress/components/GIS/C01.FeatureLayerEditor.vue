<template>
  <div ref="viewDiv" class="viewDiv" style="height:400px"></div>
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
  editor = null

const layerData = {
  id: 'edit',
  type: 'feature',
  url:
    'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1',
}

const actionList = [
  {
    key: 'clear',
    title: '清空日志',
    fn: function (ev) {
      this.logs.splice(0, this.logs.length)
    },
  },
  { key: 'init', title: '开启编辑' },
  { key: 'close', title: '结束编辑' },
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

    close() {
      console.log(editor);
      editor.clear()
    },
    init() {
      let fieldConfig = [
        {
          name: 'MC',
          label: '我是中文MC',
          visible: false,
          editorType: 'text-box', // 'text-area'
          hint: 'hint 的属性', // 鼠标移入是的小弹窗
          maxLength: -1, // 默认值
          minLength: -1, // 默认值
          domain: [
            { name: '宗地1', code: '01' },
            { name: '宗地2', code: '02' },
          ],
        },
        {
          name: 'DLFW',
          label: '我是中文DLFW',

          hint: 'hint 的属性',
        },
      ]

      gis.add(layerData).then((...args) => {
        editor = gis.widthEditor('edit', fieldConfig)
      })
    },
  },
  mounted() {
    gis = this.GIS.init(this.$refs['viewDiv'])
    // gis.on('init', () => {
    //   this.init()
    // })
  },
}
</script>

<style  >
.esri-ui {
  z-index: 1;
}
.esri-editor {
  top: 60px;
  right: 20px;
  z-index: 1000;
}

.esri-editor__header {
  position: relative;
  line-height: 32px;
  height: 38px;
  padding: 0px;
}

.esri-editor__title {
  margin: 0;
}

.esri-editor__feature-list-item {
  padding: 8px 3px;
}
</style>