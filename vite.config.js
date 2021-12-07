import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @Built by JustTwo
// author: "JustTwo"
export default defineConfig({
  plugins: [vue()],
  // 在文件中添加以下内容
  server: {
      host: '0.0.0.0'
  }
})
