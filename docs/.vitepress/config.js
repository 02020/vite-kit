/** @format */

const GIS = require('./config/GIS.js');
const guide = require('./config/guide.js');
// const fext = require('./config/fext.js');

module.exports = {
  title: 'kit',
  postcss: {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
  markdown: {
    extendMarkdown: (md) => {
      md.use(require('markdown-it-include'), {
        root: './docs/',
        includeRe: /<\[include\]\((.+)\)/i,
      });
    },
  },
  themeConfig: {
    repo: 'VITE',
    docsDir: 'docs',
    nav: [
      { text: 'GIS', link: '/GIS/' },
      // { text: 'Vue3', link: '/Vue3/' },
      // { text: 'fext', link: '/fext/' },
      { text: 'uni-app', link: '/uni-app/' },
    ],

    sidebar: {
      '/': [{ text: '首页', link: '/' }],
      '/guide/': guide,
      // '/fext/': fext,  // 目录层级 失效
      '/GIS/': GIS,
      '/uni-app/': [
        {
          text: 'uni-app',
          children: [{ text: '首页', link: '/uni-app/index' }],
        },
      ],
    },
  },
};
