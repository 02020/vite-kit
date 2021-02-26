<template>
  <div class="flex space-x-1 bg-gray-100 p-1 rounded">
    <div class="m-1 rounded cursor-pointer bg-yellow-300" @click="init">
      Symbol
    </div>

    <div
      class="p-1 bg-gray-400 cursor-pointer"
      v-for="item in actionList"
      :key="item.key"
      @click="onClick(item)"
    >
      {{ item.title }}
    </div>

    <div
      class="p-1 bg-gray-500 cursor-pointer"
      v-for="item in createList"
      :key="item.key"
      @click="onClickCreate(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
let rings = [
  [
    [118.141, 24.45],
    [118.141, 24.451],
    [118.142, 24.451],
    [118.142, 24.452],
    [118.143, 24.452],
    [118.143, 24.451],
    [118.142, 24.45],
    [118.141, 24.45],
  ],
];

const createList = [];

const actionList = [
  { key: 'symbol', title: 'symbol' },
  { key: 'polygon', title: '面' },
];

const handle = {
  polygon: () => {
    let shape = gis
      .shape()
      .withPoint({ rings })
      .withSymbol('default')
      .build()
      .goTo();
  },
  symbol: () => {
    console.log('symbol');
    // let symbol = gis.createSymbol(18, 'square', '#fffbe5', '#ffba00');
    //   symbol = gis.createSymbol(14, 'text', '#2e4e7e', '请输入文字内容');
    let symbol = gis.createSymbol(12, 22, 'http://g.com/ui/user/1.png');
    console.log(symbol.toJSON());

    let shape = gis
      .shape()
      .withPoint({ x: 118.141, y: 24.45 })
      // .withSymbol(32, 'http://g.com/web/30-seconds.png')
      .withSymbol({
        type: 'esriPMS',
        url: 'http://g.com/web/30-seconds.png',
        width: 128,
        height: 128,
        angle: 0,
        xoffset: 1,
        yoffset: 111,
      })
      .withEvent('click', (evt) => {
        console.log('click', evt);
      })

      .build()
      .goTo();
  },
};

export default {
  name: 'Symbol',

  setup(props) {
    const init = () => {};
    const onClick = (item) => {
      handle[item.key](item.key);
    };

    const onClickCreate = (item) => {};

    return { init, actionList, createList, onClick, onClickCreate };
  },
};
</script>
 