# hoc

`import BaseComponent from './base-component.vue'`

思考一下，这里的 BaseComponent 是什么？
它是函数吗？不是，虽然单文件组件会被 vue-loader 处理，但处理后的结果，也就是我们这里的 BaseComponent 仍然还是一个普通的 JSON 对象，
当你把这个对象注册为组件(components 选项)之后，
Vue 最终会以该对象为参数创建一个构造函数，该构造函数就是生产组件实例的构造函数
所以在 Vue 中组件确实是函数，只不过那是最终结果罢了，在这之前我们完全可以说在 Vue 中组件也可以是一个普通对象，就像单文件组件中所导出的对象一样。

基于此，我们知道在 Vue 中一个组件可以以纯对象的形式存在，
所以 Vue 中的高阶组件可以这样定义：
`接收一个纯对象，并返回一个新的纯对象`

```ts
export default function WithConsole_template (WrappedComponent) {
  return {
    template: '<wrapped v-on="$listeners" v-bind="$attrs" />',
    components: {
      wrapped: WrappedComponent
    },
    mounted () {
      console.log('I have already mounted')
    }
  }
}

// 高阶组件基本构成
function WithConsole(WrappedComponent) {
  return {
    mounted() {
      console.log('I have already mounted');
    },
    props: WrappedComponent.props,
    render(h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map((vnode) => {
          vnode.context = this._self;
          return vnode;
        });

      const attribute = {
        on: this.$listeners,
        props: this.$props,
        // 透传 scopedSlots
        scopedSlots: this.$scopedSlots,
        attrs: this.$attrs,
      };
      // console.log('attribute', attribute);
      return h(WrappedComponent, attribute, slots);
    },
  };
}

```

想要查看一个组件的模板被编译后的渲染函数很简单，只需要在访问 `this.$options.render` 即可。
