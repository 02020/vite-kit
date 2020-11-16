<template>
  <div ref="viewDiv" class="viewDiv" style="height:400px"></div>

  <div class="flex flex-wrap space-y-2 space-x-2 mb-2 font-mono">
    <div></div>
    <div
      class="p-1 rounded bg-yellow-300 cursor-pointer"
      v-for="item in createList"
      :key="item.key"
      @click="onClickCreate(item)"
    >{{item.title}}</div>

    <div
      class="p-1 rounded bg-yellow-300 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >{{item.title}}</div>
  </div>

  <!-- <div class="flex space-x-1 p-1 rounded" v-show="logs.length" ref="logs">{{logs}}</div> -->
</template>
<script>
let gis,
  dataDemo,
  Index,
  SketchTypeIndex,
  ActiveToolIndex,
  sketch = null

const createList = [
  { key: 'point', title: '点' },
  { key: 'multipoint', title: '多' },
  { key: 'polyline', title: '线' },
  { key: 'polygon', title: '面' },
  { key: 'circle', title: '圆' },
  { key: 'rectangle', title: '矩' },
]

const actionList = [
  {
    key: 'clear',
    title: '清空日志',
    fn: function (ev) {
      this.logs.splice(0, this.logs.length)
    },
  },
  { key: 'init', title: '初始化' },
  { key: 'edit', title: '编辑' },
  { key: 'transform', title: '变形' },
  { key: 'move', title: '移动' },
  { key: 'delete', title: '删除' },
  { key: 'redo', title: '重做' },
  { key: 'undo', title: '撤销' },
  { key: 'save', title: '保存' },
  { key: 'add', title: '新增' },
  { key: 'addMany', title: '多个' },
]

export default {
  data() {
    return {
      logs: [],
      actionList: actionList,
      createList: createList,
    }
  },
  methods: {
    onClick(item) {
      const target = this.actionList.find((x) => x.key == item.key)
      this.logs.push(item.title)
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
    onClickCreate(item) {
      this.logs.push(item.title)
      !!item.key && sketch.create(item.key)
    },
    edit() {
      // sketch.active()  //不传参默认为 reshape
      sketch.activeTool(ActiveToolIndex.Reshape)
    },
    transform() {
      // sketch.activeTool('transform')
      sketch.activeTool(ActiveToolIndex.Transform)
    },
    move() {
      // sketch.activeTool('move')
      sketch.activeTool(ActiveToolIndex.Move)
    },
    delete() {
      sketch.delete()
    },
    redo() {
      sketch.active = false
      // sketch.redo();
    },
    undo() {
      sketch.undo()
    },
    save() {
      const graphics = sketch.sketchVM.layer.graphics.toArray()
      const geo = graphics.map((x) => {
        return x.toJSON()
      })
      console.log(JSON.stringify(geo))
      console.log(geo)
    },
    add() {
      const rings = dataDemo.rings
      let symbol = gis.createSymbol(2, 'horizontal', '#f00', '#cfc')
      sketch.add({ rings })
      sketch.add({ rings }, symbol)
      //   sketch.add({ rings }, { tti: "ddd" }, symbol)
    },
    addMany() {
      const rings = dataDemo.rings
      sketch.addMany([{ rings }])
    },
    init() {
      sketch = gis.createSketch({
        id: 'sk',
        point: gis.createSymbol(32, 'http://g.com/ui/user/1.png'),
        polygon: gis.createSymbol(2, 'horizontal', '#f00', '#cfc'),
        edit: {
          point: gis.createSymbol(32, 'http://g.com/ui/user/2.png'),
        },
      })

      sketch.effect((geo, ev, type) => {
        console.log(geo, ev, type)
      })
    },
  },
  mounted() {
    dataDemo = this.GIS.dataDemo
    Index = this.GIS.Index
    SketchTypeIndex = Index.SketchTypeIndex
    ActiveToolIndex = Index.ActiveToolIndex
    gis = this.GIS.init(this.$refs['viewDiv'])
    gis.on('init', () => {
      this.init()
    })
  },
}
</script>
 