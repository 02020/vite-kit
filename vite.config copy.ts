/**
 * /*
 * https://rollupjs.org/guide/en/#big-list-of-options
 * https://github.com/vitejs/vite/blob/master/src/node/build/index.ts
 *
 * @format
 */

import path from 'path';

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config = {
  port: 3333,
  minify: false,
  assetsDir: '',
  rollupInputOptions: {
    input: 'src/dist.js',
  },
  rollupOutputOptions: {
    dir: '../../www',
    entryFileNames: 'GIS.js',
  },
  optimizeDeps: {
    include: [],
  },
  esbuildTarget: 'es2017',
  enableEsbuild: true,
  alias: {
    '/@/': pathResolve('./src'),
  },
};

module.exports = config;

/*
const {
  root = process.cwd(),
  base = '/',
  outDir = path.resolve(root, 'dist'),
  assetsDir = '_assets',
  assetsInlineLimit = 4096,
  cssCodeSplit = true,
  alias = {},
  resolvers = [],
  rollupInputOptions = {},
  rollupOutputOptions = {},
  emitIndex = true,
  emitAssets = true,
  write = true,
  minify = true,
  // default build transpile target is es2019 so that it transpiles
  // optional chaining which terser doesn't handle yet
  esbuildTarget = 'es2019',
  enableEsbuild = true,
  silent = false,
  sourcemap = false,
  shouldPreload = null,
  env = {},
  mode: configMode = 'production',
  define: userDefineReplacements,
  cssPreprocessOptions,
  cssModuleOptions = {}
} = options

*/
