<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">测试模板</div>
    <div class="flex space-x-2">
      <div
        class="p-1 rounded bg-gray-300 cursor-pointer"
        v-for="item in actionList"
        :key="item.key"
        @click="onClick(item)"
      >{{item.title}}</div>
    </div>
  </div>
</template>

<script>
let shape = null,
  editor
export default {
  name: 'Events',
  props: {
    msg: String,
  },
  data() {
    return {
      uid: '',
      actionList: [{ key: 'edit', title: '编辑图层' }],
    }
  },

  methods: {
    onClick(item) {
      this[item.key]()
    },
    edit() {
      let fieldConfig = [
        {
          name: 'MC',
          label: '我是中文MC',
          visible: false,
          editorType: 'text-box', // 'text-area'
          hint: 'hint 的属性', // 鼠标移入是的小弹窗
          maxLength: -1, // 默认值
          minLength: -1, // 默认值
          domain: [
            { name: '宗地1', code: '01' },
            { name: '宗地2', code: '02' },
          ],
        },
        {
          name: 'DLFW',
          label: '我是中文DLFW',

          hint: 'hint 的属性',
        },
      ]

      fieldConfig = [
        {
          visible: true,
          maxLength: -1,
          minLength: -1,
          domain: [],
          name: 'XH',
          label: '序号',
          editorType: 'text-box',
          hint: '1111',
        },
        {
          visible: true,
          maxLength: -1,
          minLength: -1,
          domain: [],
          name: 'MC',
          label: '名称',
          editorType: 'text-box',
          hint: '2222',
        },
        {
          visible: true,
          maxLength: -1,
          minLength: -1,
          domain: [
            { name: '宗地1', code: '01' },
            { name: '宗地2', code: '02' },
          ],
          name: 'LX',
          label: '类型',
          editorType: 'text-box',
          hint: '3333',
        },
      ]

      const layerData = {
        id: 'edit',
        type: 'feature',
        url:
          'http://www.ztgis.com:6080/arcgis/rest/services/fs_edit_xm92/FeatureServer/1',
      }

      gis.add(layerData).then((...args) => {
        editor = gis.widthEditor('edit', fieldConfig)
      })
    },
  },
  mounted() {},
}
</script>
 