const path = require('path')
const { build } = require('vite')
const libCss = require('vite-plugin-libcss')

build({
  plugins: [
    libCss()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'JdRow',
      formats: ['es', 'umd'],
      fileName: 'index'
    },
    outDir: 'lib',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    cssCodeSplit: true
  }
})
