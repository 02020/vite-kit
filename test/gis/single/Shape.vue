<!-- @format -->

<template>
  <div class="bg-gray-100 md:p-1 rounded" title="事件">
    <div class="flex space-x-1">
      <div
        class="p-1 rounded cursor-pointer bg-yellow-300"
        @click="init"
      >{{ title }} {{ enable ? '启用' : '关闭' }}</div>

      <div
        class="p-1 rounded bg-gray-300 cursor-pointer"
        v-for="item in createList"
        :key="item.key"
        @click="onClickCreate(item)"
      >{{ item.title }}</div>
    </div>

    <div class="flex flex-wrap">
      <div
        class="m-1 p-1 rounded bg-gray-400 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
let shape = null
let shapes = null
let point = { x: 118.1354, y: 24.687 },
  index = 0

export default {
  name: 'Shape',
  props: {},
  data() {
    return {
      title: 'Shape',
      enable: false,
      createList: [
        { key: 'point', title: '点' },
        { key: 'update1', title: '更新点' },
        { key: 'update2', title: '更新样式' },
      ],
      actionList: [
        { key: 'add', title: '新增' },
        { key: 'delete', title: '删除' },
        { key: 'edit', title: '编辑' },
      ],
    }
  },
  watch: {
    enable(val) {
      if (val) {
        console.log('Shape-加载')
      } else {
        console.log('Shape-未初始化')
      }
    },
  },
  methods: {
    onClickCreate(item) {
      this[item.key]()
    },
    onClick(item) {
      this[item.key]()
    },
    point() {
      shape = gis
        .shape()
        .withSymbol(32, 'circle', '#fffbe5', '#ffba00')
        .withPoint(point)
        .build()
      point.x += 0.002
    },
    update1() {
      shape.withPoint(point)
      point.x += 0.002
    },
    update2() {
      const list = ['circle', 'cross', 'diamond', 'square', 'triangle', 'x']
      shape.withSymbol(32 + index * 6, list[index], '#fffbe5', '#ffba00')
      index++
      if (index >= list.length) {
        index = 0
      }
    },
    delete() {
      shape.remove()
    },
    shapes() {
      let geoList = [],
        x = 118.1354454882645,
        y = 24.68703265536293

      for (let i = 1; i < 5; i++) {
        x += 0.002
        geoList.push({
          x,
          y,
        })
      }
      const symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00')
      shapes = gis.createShapes(geoList, symbol)
    },
    edit() {
      let shape = shapes.getItemAt(0)
      shapes.remove(shape)
    },
    add() {
      let x = 118.1354454882645,
        y = 24.67703265536293,
        symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00')
      let shape = gis.createShape(
        {
          x: x + 0.002,
          y,
        },
        symbol
      )
      shapes.add(shape.graphic)
    },

    init() {
      this.enable = !this.enable
    },
  },

  mounted() {},
}
</script>
