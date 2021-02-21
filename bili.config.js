module.exports = {
  input: 'index.js',
  output: {
    fileName: (context, defaultFileName) => {
      if (context.format === 'umd' || context.format === 'umd-min') {
        return 'in-viewport-mixin[min].js';
      }
      return 'in-viewport-mixin.[format].js';
    },
    moduleName: 'inViewportMixin',
    format: [
      'cjs',
      'es',
      'umd',
      'umd-min',
    ],
  },
  plugins: {
    commonjs: true,
    vue: {
      css: false,
    },
  },
  bundleNodeModules: true,
};