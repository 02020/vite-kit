<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">Layer</div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >{{item.title}}</div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { layerList } from '../../mock/92'

let editor

const actionList = [
  { key: 'print', title: '打印' },
  { key: 'add', title: '加载图层' },
  { key: 'edit', title: '编辑-feature' },
]

const handle = {
  print: () => {
    let layers = gis.view.map.layers.map((x) => x)
    console.log(layers)
  },
  add: () => {
    console.log(layerList)
    layerList.forEach((x) => {
      x.group = 'xm'
      x.copyright = x.id
    })
    gis.addMany(layerList)
  },
  edit: () => {
    let id = 'edit'
    let token =
      'buSjBaZvBfDH2jvH4CBuBBYhw3Oce8w9JfBZieXfWft36quzfzaGoHJOGT7JRRDB'
    let fieldConfig = [
      {
        visible: 'true',
        maxLength: '-1',
        minLength: '-1',
        domain: [],
        name: '点号',
        label: '点号',
        editorType: 'text-box',
      },
    ]

    gis
      .add({
        id,
        type: 'feature',
        url:
          'http://222.76.242.138/arcgis/rest/services/ZTT/KZD/FeatureServer/0',
        // token: token,
      },()=>{

     
      })
      .then((x) => {
      

        editor = gis.widthEditor(id, fieldConfig)
      })
  },
}

export default {
  name: 'Symbol',

  setup(props) {
    const domEdit = ref(null)

    const init = () => {}

    const onClick = (item) => {
      handle[item.key](item.key)
    }

    const onClickCreate = (item) => {}

    return { init, actionList, onClick, onClickCreate, domEdit }
  },
}
</script>
 