<template>
  <div class="bg-gray-100 md:p-1 rounded" title="事件">
    <div class="flex space-x-1">
      <div
        class="p-1 rounded cursor-pointer bg-yellow-300"
        @click="init"
      >Sketch{{ enable?"启用":"关闭" }}</div>

      <div
        class="p-1 rounded bg-gray-300 cursor-pointer"
        v-for="item in createList"
        :key="item.key"
        @click="onClickCreate(item)"
      >{{item.title}}</div>
    </div>

    <div class="flex flex-wrap">
      <div
        class="m-1 p-1 rounded bg-gray-400 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>
  </div>
</template>

<script >
let sketch = null
export default {
  name: 'Sketch',
  props: {
    msg: String,
  },
  data() {
    return {
      uid: '',
      enable: false,
      createList: [
        { key: 'point', title: '点' },
        { key: 'multipoint', title: '多' },
        { key: 'polyline', title: '线' },
        { key: 'polygon', title: '面' },
        { key: 'circle', title: '圆' },
        { key: 'rectangle', title: '矩' },
      ],
      actionList: [
        { key: 'edit', title: '编辑' },
        { key: 'transform', title: '变形' },
        { key: 'move', title: '移动' },
        { key: 'delete', title: '删除' },
        { key: 'redo', title: '重做' },
        { key: 'undo', title: '撤销' },
        { key: 'save', title: '保存' },
        { key: 'add', title: '新增' },
        { key: 'addMany', title: '多个' },
      ],
    }
  },
  watch: {
    enable(val) {
      if (val) {
        console.log('Sketch-加载')
      } else {
        console.log('Sketch-未初始化')
      }
    },
  },
  methods: {
    onClickCreate(item) {
      !!item.key && sketch.create(item.key)
    },
    onClick(item) {
      this[item.key]()
    },
    edit() {
      // sketch.active()  //不传参默认为 reshape
      sketch.activeTool('reshape')
    },
    transform() {
      sketch.activeTool('transform')
    },
    move() {
      sketch.activeTool('move')
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
      let rings = [
        [
          [118.1354454882645, 24.66703265536293],
          [118.14659098675793, 24.66703265536293],
          [118.14659098675793, 24.65725891053022],
          [118.1354454882645, 24.65725891053022],
          [118.1354454882645, 24.66703265536293],
        ],
      ]

      let symbol = gis.createSymbol(2, 'horizontal', '#f00', '#cfc')
      sketch.add({ rings })
      sketch.add({ rings }, symbol)
      //   sketch.add({ rings }, { tti: "ddd" }, symbol)
    },
    addMany() {
      let rings = [
        [
          [118.1354454882645, 24.67703265536293],
          [118.14659098675793, 24.67703265536293],
          [118.14659098675793, 24.66725891053022],
          [118.1354454882645, 24.66725891053022],
          [118.1354454882645, 24.67703265536293],
        ],
      ]

      sketch.addMany([{ rings }])
    },
    init() {
      this.enable = !this.enable

      if (!this.enable && sketch) {
        console.log('destroy')
        sketch.destroy()
      } else {
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
      }
    },
  },
  mounted() {},
}
</script>
 