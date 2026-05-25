import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  server: {
    port: 5173,
    proxy: {
      // ── 路径链路分析 ──
      // Axios baseURL = '/api/v1/shipping'
      // http.get('/ports') → 请求路径 = '/api/v1/shipping/ports'
      // Vite 匹配 '/api' 前缀 → 转发至 target，路径不做 rewrite
      // 后端收到: http://127.0.0.1:3001/api/v1/shipping/ports → ✅ 完美匹配
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        configure: (proxy) => {
          // 请求日志：追踪实际转发路径
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[Vite Proxy] → ${req.method} ${req.url} → ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`)
          })
          // 响应日志
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[Vite Proxy] ← ${proxyRes.statusCode} ${req.url}`)
          })
          // 错误处理：返回 JSON 而非让 Vite SPA fallback 吐 HTML
          proxy.on('error', (err, req, res) => {
            console.error(`[Vite Proxy] ❌ 后端不可达: ${err.message} (${req.url})`)
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                code: 502,
                msg: `Backend unreachable: ${err.message}`,
                data: null
              }))
            }
          })
        }
      }
    }
  }
})