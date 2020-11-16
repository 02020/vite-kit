<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">Symbol</div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >{{item.title}}</div>

    <div
      class="p-1 bg-gray-500 cursor-pointer"
      v-for="item in createList"
      :key="item.key"
      @click="onClickCreate(item)"
    >{{item.title}}</div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
let demoData

let rings = [
  [
    [118.141, 24.45],
    [118.141, 24.451],
    [118.142, 24.451],
    [118.142, 24.452],
    [118.143, 24.452],
    [118.143, 24.451],
    [118.142, 24.45],
    [118.141, 24.45],
  ],
]

const createList = []

const actionList = [
  { key: 'symbol', title: 'JSON' },
  { key: 'polygon', title: '面' },
]

const handle = {
  polygon: () => {
    let shape = gis
      .shape()
      .withPoint({ rings })
      .withSymbol('default')
      .build()
      .goTo()
  },
  symbol: () => {
    let symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00')
    symbol = gis.createSymbol(14, 'text', '#2e4e7e', '请输入文字内容')
    symbol = gis.createSymbol(12, 22, "http://im.png")
    console.log(symbol.toJSON())
  },
}

export default {
  name: 'Symbol',

  setup(props) {
    const init = () => {}
    const onClick = (item) => {
      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {}

    return { init, actionList, createList, onClick, onClickCreate }
  },
}
</script>
 