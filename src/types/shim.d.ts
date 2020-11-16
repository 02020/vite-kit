/** @format */

// declare module '*.vue' {
//   import Vue from 'vue';
//   export default Vue;

// }
import { Component } from 'vue';

declare module '*.vue' {
  const _default: Component;
  export default _default;
}

// declare module '*.vue' {
//   import { ComponentOptions } from 'vue'
//   const component: ComponentOptions
//   export default component
// }

declare global {
  interface module {
    title: string;
  }

  interface meta {
    moduleIndex?: string;
    module?: module;
    title?: string;
    show?: boolean;
  }

  interface route {
    path: string;
    name: string;
    component: any;
    meta?: meta;
    alias?: string;
  }

  interface variable {
    [propName: string]: any;
  }
}

export {};
