<template>
  <div class="bg-gray-100 md:p-1 rounded">
    <div class="flex space-x-1"> 
      <div class="p-1 rounded bg-gray-300  cursor-pointer"
           v-for="item in createList"
           :key="item.key"
           @click="onClickCreate(item)">{{item.title}}</div>

      <div class=" p-1 rounded bg-gray-400  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="onClick(item)">{{item.title}}</div>

    </div>

  </div>

</template>

<script> 
import { ref, watchEffect } from 'vue';

 
const list = [
  {
    label: '编辑',
    iconClass: 'dijitEditorIcon ion-ios-checkmark-outline',
    onClick: console.log,
  },
  {
    label: '编辑11',
    iconClass: 'dijitEditorIcon ion-ios-checkmark-outline',
    onClick: console.log,
  },
];


const createList = [
  { key: 'visible', title: '隐藏/显示' },
  { key: 'point', title: '点' },
  { key: 'polygon', title: '面' },

]
const actionList = [
  { key: 'help', title: '帮助' },
  { key: 'initMenu', title: '右键菜单' },
  { key: 'shape', title: 'shape&on' },
  { key: 'add', title: '' },
  { key: 'delete', title: '' },
]

export default {
  name: 'HelloGIS',

  setup (props, { emit }) {
    let stop = null
    let layer = null;
    const title = ref(null)
    const title2 = ref(null)

    title.value = "右键菜单"

    // onClick
    let handle = {
      help: () => {
        gis.help()
      },
      initMenu: () => {
        window.gis.initMenu(list)
      },
      shape: () => {
        const symbol = gis.createSymbol(64, "http://g.com/ui/user/1.png");
        let geo = {
          x: 118.1354454882645,
          y: 24.67703265536293,
        }
        let shape = gis.createShape(geo, symbol)
        gis.hitTest = true
        let falg = false
        gis.on("gis-drag", "default", (ev) => {
          gis.view.navigating = false
          falg = true

        })

        gis.view.on("drag", (ev) => {



        })
      }
    }

    const onClickCreate = (item) => { }

    const onClick = (item) => {
      handle[item.key]()
    }

    return { onClick, onClickCreate, title, createList, actionList };
  }
}
</script>
 