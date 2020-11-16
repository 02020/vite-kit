/** @format */
const shared = require('../shared/change');

const cnMap = [
  { value: 'application-config', text: '应用配置' },
  { value: 'application-api', text: '应用API' },
  { value: 'global-api', text: '全局API' },
  { value: 'instance-properties', text: '实例 property' },
  { value: 'instance-methods', text: '实例方法' },
  { value: 'directives', text: '指令' },
  { value: 'special-attributes', text: '特殊指令' },
  { value: 'built-in-components', text: '内置组件' },
  { value: '', text: '响应式 API' },
  { value: 'composition-api', text: '组合 API' },
];

const api = [
  '/api/application-config',
  '/api/application-api',
  '/api/global-api',
  {
    title: '选项',
    collapsable: false,
    children: [
      '/api/options-data',
      '/api/options-dom',
      '/api/options-lifecycle-hooks',
      '/api/options-assets',
      '/api/options-composition',
      '/api/options-misc',
    ],
  },
  '/api/instance-properties',
  '/api/instance-methods',
  '/api/directives',
  '/api/special-attributes',
  '/api/built-in-components',
  {
    title: '响应式 API',
    collapsable: false,
    children: [
      '/api/basic-reactivity',
      '/api/refs-api',
      '/api/computed-watch-api',
    ],
  },
  '/api/composition-api',
];

const guide = [
  {
    title: '基础',
    collapsable: false,
    children: [
      '/guide/installation',
      '/guide/introduction',
      '/guide/instance',
      '/guide/template-syntax',
      '/guide/computed',
      '/guide/class-and-style',
      '/guide/conditional',
      '/guide/list',
      '/guide/events',
      '/guide/forms',
      '/guide/component-basics',
    ],
  },
  {
    title: '深入组件',
    collapsable: false,
    children: [
      '/guide/component-registration',
      '/guide/component-props',
      '/guide/component-attrs',
      '/guide/component-custom-events',
      '/guide/component-slots',
      '/guide/component-provide-inject',
      '/guide/component-dynamic-async',
      '/guide/component-template-refs',
      '/guide/component-edge-cases',
    ],
  },
  {
    title: '过渡&动画',
    collapsable: false,
    children: [
      '/guide/transitions-overview',
      '/guide/transitions-enterleave',
      '/guide/transitions-list',
      '/guide/transitions-state',
    ],
  },
  {
    title: '可复用性&组合',
    collapsable: false,
    children: [
      '/guide/mixins',
      '/guide/custom-directive',
      '/guide/teleport',
      '/guide/render-function',
      '/guide/plugins',
    ],
  },
  {
    title: '高级指南',
    collapsable: false,
    children: [
      {
        title: '响应式',
        children: [
          '/guide/reactivity',
          '/guide/reactivity-fundamentals',
          '/guide/reactivity-computed-watchers',
        ],
      },
      {
        title: '组合 API',
        children: [
          '/guide/composition-api-introduction',
          '/guide/composition-api-setup',
          '/guide/composition-api-lifecycle-hooks',
          '/guide/composition-api-provide-inject',
          '/guide/composition-api-template-refs',
        ],
      },
      '/guide/optimizations',
      '/guide/change-detection',
    ],
  },
  {
    title: '工具',
    collapsable: false,
    children: [
      '/guide/single-file-component',
      '/guide/testing',
      '/guide/typescript-support',
    ],
  },
  {
    title: '规模化',
    collapsable: false,
    children: ['/guide/routing', '/guide/state-management', '/guide/ssr'],
  },
  {
    title: '无障碍',
    collapsable: false,
    children: [
      '/guide/a11y-basics',
      '/guide/a11y-semantics',
      '/guide/a11y-standards',
      '/guide/a11y-resources',
    ],
  },
  {
    title: '从 Vue 2 迁移',
    collapsable: true,
    children: [
      'migration/introduction',
      'migration/async-components',
      'migration/attribute-coercion',
      'migration/custom-directives',
      'migration/custom-elements-interop',
      'migration/data-option',
      'migration/events-api',
      'migration/filters',
      'migration/fragments',
      'migration/functional-components',
      'migration/global-api',
      'migration/global-api-treeshaking',
      'migration/inline-template-attribute',
      'migration/keycode-modifiers',
      'migration/render-function-api',
      'migration/slots-unification',
      'migration/transition',
      'migration/v-model',
    ],
  },
  {
    title: '贡献文档',
    collapsable: true,
    children: [
      'contributing/writing-guide',
      'contributing/doc-style-guide',
      'contributing/translations',
    ],
  },
];

module.exports = {
  api: shared.toConfig3(api, cnMap, 'Vue3'),
  guide: shared.toConfig3(guide, cnMap, 'Vue3'),
};
