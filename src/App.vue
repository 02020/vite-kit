<script lang="ts">
// 路由页面
import { onMounted } from 'vue'
import axios from  './__others/axios/axios'



export default {
  name: 'App',
  components: {},
  setup() {
    onMounted(() => {

     console.log('App');
    })
  },
}
</script>

<template>
  <router-view />
</template>
