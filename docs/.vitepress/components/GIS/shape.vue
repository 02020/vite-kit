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
import GIS from './_init'
import { geo, point, rings, paths } from './data'
let shape = null,
  shapePoint = null, 
  index = 0;
const actionList = [
  {
    key: 'clear',
    title: '清空日志',
    fn: function (ev) {
      this.logs.splice(0, this.logs.length)
    },
  },
  { key: 'init', title: '加载图形' },
  { key: 'popup', title: '增加弹窗(传入dom)' },
  { key: 'title', title: '增加弹窗(标题)' },
  { key: 'mouse', title: '增加鼠标移出事件' },
  { key: 'editMove', title: '编辑->移动' },
  { key: 'batch', title: '鼠标移开则删除' },
  { key: 'points', title: '多样式点' },
  { key: 'create', title: '创建点' },
  { key: 'update1', title: '更新点' },
  { key: 'update2', title: '更新样式' },
]

export default {
  data() {
    return {
      logs: [],
      createList: [],
      actionList: actionList,
      gis: null,
      shape: null,
    }
  },
  methods: {
    onClick(item) {
      this.logs.push(item.title)
      const target = this.actionList.find((x) => x.key == item.key)
      !!target.fn ? target.fn.apply(this) : this[target.key]()
    },
    init() {
      shape = this.gis.shape('shape1').withPoint(geo).build().goTo()
    },
    title() {
      shape.withTitle('{SHAPE}').open()
    },
    popup() {
      shape.withPopup('{SHAPE}', this.$refs['logs']).open()
    },
    mouse() {
      if (!shape) return
      shape.withEvent('mouse-leave', (ev) => {
        // this.shape.goTo() 事件内部不能勿定位相关方法，交互异常
        shape.open()
      })
    },
    batch() {
      for (let i = 1; i < 5; i++) {
        geo.geometry.rings[0].forEach((x) => {
          x[0] += 0.0021
        })
        this.gis.shape('shape').withPoint(geo).build().goTo().withLeaveRemove()
      }
    },
    editMove() {
      shape.withSketch('move').effect((ev) => {
        console.log(ev)
      })
    },
    create() {
      shapePoint = this.gis
        .shape()
        .withSymbol(32, 'circle', '#fffbe5', '#ffba00')
        .withPoint(point)
        .goTo()
        .build()
    },
    update1() {
      shapePoint.withPoint(point)
      point.x += 0.002
    },
    update2() {
      const list = ['circle', 'cross', 'diamond', 'square', 'triangle', 'x']
      shapePoint.withSymbol(32 + index * 6, list[index], '#fffbe5', '#ffba00')
      index++
      if (index >= list.length) {
        index = 0
      }
    },
  },
  mounted() {
    this.gis = GIS(this.$refs['viewDiv'])
  },
}
</script>
