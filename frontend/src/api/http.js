import axios from 'axios'

const http = axios.create({
  baseURL: '/api/v1/shipping',
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
})

// ── 请求拦截：日志追踪 ──
http.interceptors.request.use((config) => {
  console.debug(`[HTTP] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

// ── 响应拦截：HTML 劫持检测 + 业务码解包 ──
http.interceptors.response.use(
  (response) => {
    // 防御性检测：如果后端返回了 HTML 而非 JSON（被 SPA fallback 劫持）
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('text/html')) {
      console.error(
        `[HTTP] ❌ 收到 HTML 响应而非 JSON！请求路径: ${response.config.url}\n` +
        `  → 完整 URL: ${response.config.baseURL}${response.config.url}\n` +
        `  → 可能原因: 后端未启动 / 路径不匹配 / Vite SPA fallback 返回了 index.html`
      )
      return Promise.reject(new Error(
        `API 返回了 HTML 而非 JSON (${response.config.url})，请确认后端 :3001 是否正常运行`
      ))
    }

    const { code, msg, data } = response.data
    if (code !== 200) {
      console.error(`[HTTP] ❌ 业务错误: ${msg}`)
      return Promise.reject(new Error(msg || 'Unknown API error'))
    }
    console.debug(`[HTTP] ✅ ${response.config.url} 数据获取成功`)
    return data
  },
  (error) => {
    if (error.response) {
      console.error(
        `[HTTP] ❌ 响应错误 ${error.response.status}: ${error.config?.url}\n` +
        `  → Content-Type: ${error.response.headers['content-type']}`
      )
    } else if (error.request) {
      console.error(`[HTTP] ❌ 网络不可达: ${error.config?.url} — ${error.message}`)
    } else {
      console.error(`[HTTP] ❌ 请求配置错误: ${error.message}`)
    }
    return Promise.reject(error)
  }
)

export default http
