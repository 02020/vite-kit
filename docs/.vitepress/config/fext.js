/** @format */
const shared = require('../shared/change');

const cnMap = [
  // { value: 'application-config', text: '应用配置' },
];
const list = [
  {
    title: 'form-builder',
    collapsable: false,
    children: [
      {
        title: 'API',
        children: [
          '/vue-form-builder/api/component',
          '/vue-form-builder/api/factory',
        ],
      },
      {
        title: 'guide',
        children: [
          '/vue-form-builder/guide/start',
          '/vue-form-builder/guide/shares',
          '/vue-form-builder/guide/metadata',
          '/vue-form-builder/guide/event',
          '/vue-form-builder/guide/custom',
        ],
      },
      '/vue-form-builder/contact',
      '/vue-form-builder/intro',
    ],
  },
];

module.exports = shared.toConfig3(list, cnMap, 'fext');
