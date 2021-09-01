import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import';
const { resolve } = require('path')
// import { loadEnv } from 'vite'
// export default ({ mode }) => {
//   return defineConfig({
//           plugins: [vue()],
//           base:loadEnv(mode, process.cwd()).VITE_APP_NAME
//       })
// }
// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        detail: resolve(__dirname, 'detail.html')
      }
    },
    outDir: `dist.${mode}`,
  },
  alias: {
    '@': resolve(__dirname, './src'),
    'comps': resolve(__dirname, 'src/components')
  },
  optimizeDeps: {
    include: ["amfe-flexible", "vant"]
  },
  // 引用全局 scss
  cssPreprocessOptions: {
    scss: {
      additionalData: '@import "./src/assets/style/index.scss";'
    }
  },
  // 压缩
  minify: 'esbuild',
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  /**
   * Base public path when served in production.
   * @default '/'
   */
  base: './',
  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  // outDir: `dist.${MODE}`,
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        },
      ],
    }),
  ]
})
