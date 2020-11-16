<template>
  <div
    class="flex flex-row space-y-1 text-center rounded bg-gray-200 m-2"
    v-for="(group, index) in actionList"
    :key="group.name"
  >
    <div class="flex flex-wrap bg-blu-200">
      <div
        class="text-center font-medium text-yellow-100 bg-blue-600 px-4 py-2 m-2"
      >
        {{ group.name }}
      </div>
      <div
        class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2"
        v-for="item in group.items"
        :key="item.key"
        @click="onClick(index, item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>
<script>
const actionList = [
  {
    name: '01',
    items: [
      {
        key: 'uviewui',
        title: 'uviewui',
        fn: function (ev) {
          const url = 'https://www.uviewui.com/components/topTips.html'
          window.open(url, '', 'width=1600,height=800')
        },
      },
      {
        key: 'b',
        title: '清空日志',
        fn: function (ev) {},
      },
    ],
  },
]

export default {
  data() {
    return {
      actionList
    }
  },
  methods: {
    onClick(index, item) {
      const target = this.actionList[index].items.find((x) => x.key == item.key)
      target.fn.apply(this)
    },
    init() {},
  },
  mounted() {
    this.init()
  }
}
</script>