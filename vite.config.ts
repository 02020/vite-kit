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
