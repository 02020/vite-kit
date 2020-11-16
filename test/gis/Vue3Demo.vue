<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300"
         @click="init">Draw</div>

    <div class="p-1  bg-gray-400  cursor-pointer"
         v-for="item in actionList"
         :key="item.key"
         @click="onClick(item)">{{item.title}}</div>

    <div class="p-1 bg-gray-400  cursor-pointer"
         v-for="item in createList"
         :key="item.key"
         @click="onClickCreate(item)">{{item.title}}</div>

  </div>

</template>

<script> 
import { ref, watchEffect } from 'vue';
 
const createList = [
  { key: ' ', title: ' ' }
]

const actionList = [ 
  { key: ' ', title: ' ' },
]

export default {
  name: 'Demo',

  setup (props) {

    let handle = {

    }

    const init = () => {

    }
    const onClick = (item) => {
      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {

    }

    return { init, onClick, actionList, createList, onClickCreate };
  }
}
</script>
 