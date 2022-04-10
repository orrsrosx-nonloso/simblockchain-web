import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {styleImport,createStyleImportPlugin,VantResolve} from 'vite-plugin-style-import'

// @Built by JustTwo
// author: "JustTwo"
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [VantResolve()],
    }),

  ],
  // 在文件中添加以下内容
  server: {
    host: '0.0.0.0'
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    commonjsOptions:{
      requireReturnsDefault:'namespace'
    }
  },
  chunkSizeWarningLimit: 1800,
})
