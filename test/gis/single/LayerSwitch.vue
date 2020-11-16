<template>
  <div class="bg-gray-100 md:p-1 rounded"
       title="事件">
    <div class="mb-2 p-1 rounded cursor-pointer bg-yellow-300"  ref='app-click'
         @click="init">{{title}}{{enable?"启用":"关闭" }}</div>

    <div class="flex flex-wrap"  ref='app'>
      <div class=" m-1 p-1 rounded bg-gray-400  cursor-pointer"
           v-for="item in actionList"
           :key="item.key"
           @click="onClick(item)">{{item.title}}</div>

    </div>

    <div class=" absolute bg-gray-100 rounded"
         style="width:250px;right:210px;bottom:0px">

      <div class="flex flex-wrap">
        <div class=" m-1 p-1 rounded bg-gray-400  cursor-pointer"
             v-for="item in mockList"
             :key="item.layerName"
             @click="onClickItem(item)">{{item.layerName}}</div>

      </div>

    </div>

  </div>

</template>

<script> 
import { format, getVisibleParam, init, mockList } from '../ts/switch';

export default {
  name: 'Sketch',
  props: {
    msg: String,
  },
  data () {
    return {
      mockList: mockList,
      title: 'Layer 监听 ',
      enable: false,
      createList: [],
      actionList: [
 
        { key: 'add', title: '添加图层' },
        { key: 'delete', title: '删除图层' },
        { key: 'group', title: 'group' },
      ],
    };
  },
  watch: {
    enable (val) {
      if (val) {
        console.log('Layer-加载');
      } else {
        console.log('Layer-未初始化');
      }
    },
  },
  methods: {
    onClick (item) {
      this[item.key]();
    },
    onClickItem (item) {
      console.log(item)
      gis.add({
        url: item.layerUrl,
        type: format(item.loadType),
        group: "test"
      })
 
    },
    change () {
      console.log(gis.layerList)
      const p = getVisibleParam();
      console.log(p)
      gis.update(p)
    },
    delete () {
      gis.delete("image01")
    },
    add () {
    }, 
    group () {
      console.log(gis.getMany("test"))
    },
    init () {
      this.enable = !this.enable
    },
  },
  mounted () {
    gis.on("gis-create", (layer) => {
      console.log("图层加载成功", layer)
    })
  },
};

</script>
