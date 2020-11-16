<template>
  <div class="bg-gray-100 md:p-1 rounded">
    <!-- {{state}} -->
    <div class="flex flex-wrap">
      <div class="m-1 p-1 rounded bg-gray-400  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="onClick(item)">{{item.title}}</div>

    </div>

  </div>

</template>

<script> 

import { reactive, effect } from './vue3/reactivity'

const actionList = [
  { key: 'change', title: '改变' },
]


var myObject = {
  foo: 1,
  bar: 2,
  get baz () {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};
var baz = Reflect.get(myObject, 'baz', myReceiverObject) // 8

 

export default {
  name: 'Vue3',

  setup () {

    const state = reactive({
      name: 'mojie',
      //  age: 29,
      //  hobbies: ['pet', 'read', 'music']
    })

    effect(() => {
      console.log('effect1', state.name)
      // console.log('effect1', JSON.stringify(state.hobbies))
      //  console.log('effect1', state.sex)
    })

    effect(() => {
      console.log('effect2', state.name)
    })


    let handle = {

      change: () => {
        state.name = + new Date()
        state.name = + new Date()
        state.name = + new Date()
        //  state.hobbies.push('coding')
        // state.sex = 'male'

      },
      add: () => {
        stop = effect(() => { })
      },
      delete: () => { stop() }
    }

    const onClick = (item) => {
      handle[item.key]()
    }

    return { onClick, state, actionList };
  }
}
</script>
 