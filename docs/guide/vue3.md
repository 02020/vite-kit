# Vue3

[vue2](https://template-explorer.vuejs.org/)
[vue3](https://vue-next-template-explorer.netlify.app/)
 





在vue3中，插槽要通过函数调用的形式。

`{props.desc()}  ===  {props.$slots.desc()[0]}`


创建

```ts
createApp(Main).mount('#app');

app.config.isCustomElement = tag => /^x-/.test(tag);
app.directive('AtSign', AtSign);
```

## 代码学习

### grid

1. 过滤
1. 排序: -1 * -1 = 1


1. 对数组施加sort操作，会修改调用sort的数据内元素的原始位置。
2. 因此为了保证不对sort方法调用的原数组产生副作用(side effect)，我们使用slice()对原始数组进行一个深拷贝
3. slice另一种很有用的做法是将类数组对象转化为真正的数组对象。

 

Vue3中不再构建UMD模块化的方式，因为UMD会让代码有更多的冗余，它要支持多种模块化的方式。Vue3中将CJS、ESModule和自执行函数的方式分别打包到了不同的文件中。在packages/vue中有Vue3的不同构建版本。

cjs（两个版本都是完整版，包含编译器）
vue.cjs.js
vue.cjs.prod.js（开发版，代码进行了压缩）

global（这四个版本都可以在浏览器中直接通过scripts标签导入，导入之后会增加一个全局的Vue对象）
vue.global.js（完整版，包含编译器和运行时）
vue.global.prod.js（完整版，包含编译器和运行时，这是开发版本，代码进行了压缩）
vue.runtime.global.js
vue.runtime.global.prod.js

browser（四个版本都包含esm，浏览器的原生模块化方式，可以直接通过
`<script type="module" />`
的方式来导入模块）
vue.esm-browser.js
vue.esm-browser.prod.js
vue.runtime.esm-browser.js
vue.runtime.esm-browser.prod.js

bundler（这两个版本没有打包所有的代码，只会打包使用的代码，需要配合打包工具来使用，会让Vue体积更小）
vue.esm-bundler.js
bue.runtime.esm-bundler.js