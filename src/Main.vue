<template>
  <div>Vue3测试使用</div>
  <div class="bg-gray-400 md:p-4 rounded" @click="onClick">{{title}}</div>
</template>

<script lang='ts'>
import { ref, watchEffect } from 'vue'
import { isArray } from './shared'

import executeTest from './__others/learn/test'


export default {
  name: 'Hello',
  components: { },
  setup(props, { emit }) {
    let stop = null
    let layer = null
    const title = ref(null)
    const title2 = ref(null)

    title.value = '点击'

    const fn = () => {
      console.log('s')
    }
    const onClick = () => {
       executeTest()
    }

    const aa = () => {
      console.log('aaaa')
    }

    return { onClick, title, aa }
  },
}
</script>
 