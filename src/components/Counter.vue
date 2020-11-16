<template>
  <div class="h-full flex justify-center items-center flex-col">
    <div class="text-red-500 text-2xl">
      {{ count }}
    </div>
    <button class="btn" @click="increment">
      Increment
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { WebStorage } from '../shared/vue-ls/src/storage'; 
const ls = new WebStorage(localStorage);

ls.set('foo', 'boo');
console.log(ls.get('foo'));


export default defineComponent({
  setup() {
    const count = ref(0);
    function increment() {
      count.value++;
    }
    return { count, increment };
  },
});



</script>