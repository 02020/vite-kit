<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300"
         @click="init">Layer</div>

    <div class="p-1  bg-gray-400  cursor-pointer"
         v-for="item in actionList"
         :key="item.key"
         @click="onClick(item)">{{item.title}}</div>

    <div class="p-1 bg-gray-500  cursor-pointer"
         v-for="item in createList"
         :key="item.key"
         @click="onClickCreate(item)">{{item.title}}</div>

  </div>

</template>

<script> 
import { ref, watchEffect } from 'vue';

let rings = [
  [
    [118.1354454882645, 24.66703265536293],
    [118.14659098675793, 24.66703265536293],
    [118.14659098675793, 24.65725891053022],
    [118.1354454882645, 24.65725891053022],
    [118.1354454882645, 24.66703265536293],
  ],
], paths = [
  [
    [118.1354454882645, 24.67703265536293],
    [118.14659098675793, 24.67703265536293],
    [118.14659098675793, 24.66725891053022],
  ],
],
  symbol = {
    style: "solid",
    color: "rgba(255,255,255,0.9)",
    outline: {
      color: "rgb(255, 30, 0)",
      style: "dash",
      width: 4
    }
  };

const createList = [

]

const actionList = [
  { key: 'print', title: '打印' },
  { key: 'white', title: '白' },
  { key: 'whiteR', title: '白(逆)' },
  { key: 'yellow', title: '黄' },
  { key: 'red', title: '红' }
]

const handle = {
  print: () => {
    let layers = gis.view.map.layers.map(x => x)
    console.log(layers)
  },
  white: () => {
    gis.update([{ ids: "white", reorder: 1 }, { ids: "white1", reorder: 2 }])
  },
  whiteR: () => {
    gis.update([{ ids: "white1", reorder: 2 }, { ids: "white", reorder: 1 }])
  },
  yellow: () => {
    gis.update({ ids: "yellow", reorder: 0 })
  },
  red: () => {
    gis.update([{ ids: "red", reorder: 2 }])
  }
}

export default {
  name: 'Symbol',

  setup (props) {
    const init = () => {

      gis.shape("white", 3).withSymbol(symbol).withPoint({ rings }).build()

      rings[0].forEach((x) => { x[0] += 0.001; });
      symbol.color = "rgba(255,255,200,0.9)"
      gis.shape("white1", 3).withSymbol(symbol).withPoint({ rings }).build()


      rings[0].forEach((x) => { x[0] += 0.001; });
      symbol.color = "rgba(255,255,0,0.9)"

      gis.shape("yellow", 2).withSymbol(symbol).withPoint({ rings }).build()

      rings[0].forEach((x) => { x[0] += 0.001; });
      symbol.color = "rgba(255,0,0,0.9)"
      gis.shape("red", 1).withSymbol(symbol).withPoint({ rings }).build().goTo();

    }

    const onClick = (item) => {

      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {

    }

    return { init, actionList, createList, onClick, onClickCreate };
  }
}
</script>
 