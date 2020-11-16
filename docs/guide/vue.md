<!-- @format -->

# Vue

## demo

```html
<template>
  <form
    class="el-form"
    :class="[
      labelPosition ? 'el-form--label-' + labelPosition : '',
      { 'el-form--inline': inline },
    ]"
  >
    <slot></slot>
  </form>
</template>
<script>
  export default {
    name: 'ElForm',
    componentName: 'ElForm',
    mixins: [],
    components: {},
    props: {
      model: Object,
      labelWidth: String,
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true,
      },
    },
    computed: {},
    watch: {
      rules() {},
    },
    data() {
      return {
        fields: [],
      };
    },
    created() {},
    methods: {
      validate(callback) {},
    },
  };
</script>
<style></style>
```

## 生命周期

```ts
var app = new Vue({
  el: '#app',
  data: {
    number: 1,
  },
  beforeCreate: function () {
    console.log('beforeCreate 钩子执行...');
    console.log(this.number);
  },
  created: function () {
    console.log('created 钩子执行...');
    console.log(this.number);
  },
  beforeMount: function () {
    console.log('beforeMount 钩子执行...');
    console.log(this.number);
  },
  mounted: function () {
    console.log('mounted 钩子执行...');
    console.log(this.number);
  },
  beforeUpdate: function () {
    console.log('beforeUpdate 钩子执行...');
    console.log(this.number);
  },
  updated: function () {
    console.log('updated 钩子执行...');
    console.log(this.number);
  },
  beforeDestroy: function () {
    console.log('beforeDestroy 钩子执行...');
    console.log(this.number);
  },
  destroyed: function () {
    console.log('destroyed 钩子执行...');
    console.log(this.number);
  },
});
```

# API

## Mixins 混入

```ts
export const gisMixins = {
  data() {
    return {
      testMix: '混入对象的data',
    };
  },
  created() {},
  methods: {
    mixinsFun() {},
  },
  computed: {
    testMix2() {
      return this.testMix;
    },
  },
  watch: {
    testMix(newVal, oldVal) {},
  },
};

```

## Route
```ts

```
## Render

[render](https://cn.vuejs.org/v2/guide/render-function.html?)

### createElement

```ts
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar',
      },
    }),
  ]
);
```

#### createElement 的 attribute

```ts
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:key up.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}

```
# hoc
[button](https://juejin.im/post/6844903751057145869)


# ddd
```html
<input v-model="value" />
<input v-bind:value="value" v-on:input="value= $event.target.value" />
```



