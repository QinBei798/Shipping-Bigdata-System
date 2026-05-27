# 🌌 MaritimeScope · 航运态势感知大屏

> **全球船舶实时态势感知 · 枢纽港口吞吐联动分析 · BDI 多维透视 · 航线运力数字孪生**

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white&style=flat-square)
![ECharts](https://img.shields.io/badge/ECharts-5.6-AA344D?logo=apacheecharts&logoColor=white&style=flat-square)
![Pinia](https://img.shields.io/badge/Pinia-3.x-FFD859?logo=pinia&logoColor=333&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white&style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-3.x-6E9F18?logo=vitest&logoColor=white&style=flat-square)
![TDD](https://img.shields.io/badge/TDD-100%25_Pass-0B8C38?style=flat-square)
![Node](https://img.shields.io/badge/Node-v20+-339933?logo=nodedotjs&logoColor=white&style=flat-square)

</div>

---

## 📡 项目定位

MaritimeScope 是一个面向国际航运大数据场景的 **单体大仓 (Monorepo) 全栈态势感知大屏平台**。系统以 1920×1080 固定分辨率数字孪生看板为载体，实时呈现全球船舶 AIS 动态、Top 10 枢纽港口吞吐量、BDI/BCI/BPI/BSI 多维航运指数走势及主要航线运力分布，为航运分析决策提供一站式可视化支撑。

---

## ⚙️ 环境与依赖

### 🖥️ 系统环境

| 组件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | ≥18.0 | 20.20+ | Vite 6 强制要求 ≥18；推荐 LTS 20 |
| npm | ≥9.0 | 10.x | 随 Node 20 内置 |
| WSL / Linux | — | Ubuntu 22.04+ | 开发环境；纯 Windows 亦可 |
| Git | ≥2.30 | 2.40+ | 版本控制 |

```bash
# 安装后校验
node --version   # v20.x.x
npm --version    # 10.x.x
```

---

### 📦 根目录 · Workspace Root

| 依赖 | 需求版本 | 锁定版本 | 层级 | 用途 |
|------|----------|----------|------|------|
| `concurrently` | ^9.2.1 | `9.2.1` | devDependencies | 前后端双工服务并行编排 |

---

### 🎨 前端 · Frontend (shipping-visual-frontend)

#### 运行时依赖 (dependencies)

| 依赖 | 需求版本 | 锁定版本 | 用途 |
|------|----------|----------|------|
| `vue` | ^3.5.16 | `3.5.34` | 渐进式响应 UI 框架 (Composition API) |
| `echarts` | ^5.6.0 | `5.6.0` | 多维数据可视化图表引擎 |
| `pinia` | ^3.0.2 | `3.0.4` | 类型安全全局状态管理 |
| `axios` | ^1.9.0 | `1.16.1` | Promise 风格 HTTP 客户端 |
| `vue-router` | ^4.5.1 | `4.6.4` | SPA 路由导航 |

#### 开发与构建依赖 (devDependencies)

| 依赖 | 需求版本 | 锁定版本 | 用途 |
|------|----------|----------|------|
| `vite` | ^6.3.5 | `6.4.2` | 极速 HMR 开发服务器与生产构建 |
| `@vitejs/plugin-vue` | ^5.2.4 | `5.2.4` | Vue SFC 编译插件 |
| `tailwindcss` | ^4.1.12 | `4.3.0` | 原子化 CSS 骨架 |
| `@tailwindcss/vite` | ^4.1.12 | `4.3.0` | TailwindCSS Vite 集成插件 |
| `vitest` | ^3.1.1 | `3.2.4` | 单元 / 集成测试框架 |
| `@vue/test-utils` | ^2.4.6 | `2.4.10` | Vue 组件挂载测试实用工具 |
| `jsdom` | ^26.1.0 | `26.1.0` | 无浏览器 DOM 模拟 (测试环境) |

#### 核心传递依赖 (Key Transitive Dependencies)

| 依赖 | 锁定版本 | 关联主包 | 用途 |
|------|----------|----------|------|
| `zrender` | `5.6.1` | echarts | Canvas/SVG 二维渲染内核 |
| `postcss` | `8.5.15` | tailwindcss, vite | CSS 转换管道 |
| `esbuild` | `0.25.12` | vite | Go 编写的高速 JS/CSS 打包器 |
| `rollup` | `4.60.4` | vite | 生产构建 Tree-shaking 打包 |
| `lightningcss` | `1.32.0` | tailwindcss v4 | Rust 编写的高速 CSS 编译器 |
| `@babel/parser` | — | vue/compiler-sfc | 模板编译 AST 解析 |
| `tinyglobby` | `0.2.16` | vitest | 测试文件快速匹配 |
| `chai` | `5.3.3` | vitest | BDD/TDD 断言库 |
| `happy-dom` | — | (备选 jsdom) | 轻量级 DOM 模拟替代方案 |

---

### 🔧 后端 · Backend (shipping-mock-server)

#### 运行时依赖 (dependencies)

| 依赖 | 需求版本 | 锁定版本 | 用途 |
|------|----------|----------|------|
| `express` | ^5.1.0 | `5.1.0` | 轻量级 HTTP 服务框架 |
| `cors` | ^2.8.5 | `2.8.5` | 跨域资源共享中间件 |

#### 开发与构建依赖 (devDependencies)

| 依赖 | 需求版本 | 锁定版本 | 用途 |
|------|----------|----------|------|
| `vitest` | ^3.1.1 | `3.2.4` | API 端点契约测试 |
| `supertest` | ^7.1.0 | `7.1.0` | HTTP 断言与请求模拟 |

---

## 🚀 三步启动指南

### 第一步 · 一键同步依赖

```bash
npm install && cd frontend && npm install && cd ../server && npm install && cd ..
```

### 第二步 · 全库 TDD 冒烟测试

```bash
npm test
```

预期输出：

```
✓ frontend — 42 tests passed (10 files)
✓ server   — 10 tests passed (1 file)
```

### 第三步 · 并发双工服务挂载

```bash
npm run dev
```

### 端口映射矩阵

```
┌──────────────────┬──────────────────────────────────────────┐
│  服务            │  地址                                    │
├──────────────────┼──────────────────────────────────────────┤
│  Frontend (Vite) │  http://localhost:5173                    │
│  Backend (API)   │  http://localhost:3001/api/v1/shipping   │
└──────────────────┴──────────────────────────────────────────┘
```

---

## 🌐 网络拓扑与跨域防御

```
┌──────────┐   GET /api/v1/shipping/*    ┌───────────────┐
│  Browser │ ───────────────────────────→ │  Vite (:5173) │
│          │                              │               │
│          │                              │  Proxy Match  │
│          │                              │  '/api' prefix │
│          │                              └───────┬───────┘
│          │                                      │
│          │                    Proxy Forward     │
│          │               target: 127.0.0.1:3001 │
│          │               changeOrigin: true      │
│          │                                      ▼
│          │                              ┌───────────────┐
│          │                              │ Express(:3001)│
│          │                              │               │
│          │                              │ /api/v1/      │
│          │                              │   shipping/   │
│          │                              │   ├─ ports    │
│          │                              │   ├─ vessels  │
│          │                              │   ├─ routes   │
│          │                              │   └─ indices  │
│          │                              └───────────────┘
```

**防御性配置要点：**

- **绝对 IPv4 地址** — `target: 'http://127.0.0.1:3001'` 而非 `localhost`，规避 WSL 环回地址 IPv6 解析断流
- **changeOrigin: true** — 修改请求头 `Origin`/`Host`，消除跨源拒绝
- **502 JSON 错误拦截** — `configure` 回调中注册 `error` 事件，返回标准 JSON 错误体而非 SPA fallback HTML，防止前端 JSON 解析崩链

---

## 🧪 TDD 工程质量铭牌

| 指标 | 数值 |
|------|------|
| 后端 API 契约文件 | 1 (`server/__tests__/shipping.test.js`) |
| 前端测试规格文件 | 10 (组件 + 组合式函数 + Store + 视图) |
| 测试断言总数   | 52 |
| 通过率          | 100% |
| 测试环境        | jsdom (前端) / Node.js (后端) |
| 内存泄漏防护    | `onBeforeUnmount` dispose + `ResizeObserver.disconnect` |

### 前端测试覆盖矩阵

| 测试文件 | 覆盖范围 |
|----------|----------|
| `BaseChart.test.js` | ECharts 初始化、setOption 暴露、实例销毁 |
| `HeaderTitle.test.js` | 标题渲染、实时时钟更新 |
| `LeftPanel.test.js` | 港口数据渲染、空数据加载占位 |
| `MapContainer.test.js` | GeoJSON 加载、ECharts map 注册 |
| `RouteCapacity.test.js` | 航线运力饼图、Store 响应联动 |
| `ShippingIndex.test.js` | 指数折线图、多系列渲染 |
| `useScreenScale.test.js` | 屏幕缩放自适应算法 |
| `map.test.js` | MapStore 路由/船舶状态管理 |
| `market.test.js` | MarketStore 港口/指数状态管理 |
| `Dashboard.test.js` | 主视图装配、GeoJSON 加载、API 调用统计 |

### 后端 API 契约矩阵

| 端点 | 方法 | 断言数 |
|------|------|--------|
| `/api/v1/shipping/ports` | GET | 3 |
| `/api/v1/shipping/indices` | GET | 2 |
| `/api/v1/shipping/routes` | GET | 2 |
| `/api/v1/shipping/vessels` | GET | 3 |

---

## 📁 项目骨架

```
shipping-bigdata-system/
├── package.json                          # 大仓根脚本 (concurrently)
├── server/
│   ├── index.js                          # Express 入口，挂载 /api/v1/shipping
│   ├── routes/shipping.js                # 四端点路由分发
│   ├── data/
│   │   ├── ports.js                      # 2025 年真实港口吞吐量数据
│   │   ├── vessels.js                    # AIS 船舶模拟数据生成器
│   │   ├── routes.js                     # 全球航线运力部署矩阵
│   │   └── indices.js                    # BDI/BCI/BPI/BSI 指数采样
│   └── __tests__/shipping.test.js        # API 契约测试
├── frontend/
│   ├── vite.config.js                    # Vite Proxy 配置 (防 IPv6/SPA fallback)
│   ├── vitest.config.js                  # jsdom 测试环境 + setupFiles
│   ├── public/data/world.json            # Natural Earth 110m GeoJSON
│   └── src/
│       ├── api/
│       │   ├── http.js                   # Axios 实例 (baseURL + 拦截器)
│       │   └── shipping.js               # 四端点请求封装
│       ├── store/modules/
│       │   ├── map.js                    # 地图/船舶/路由 Store
│       │   └── market.js                 # 港口/指数 Store
│       ├── composables/
│       │   ├── useECharts.js             # 抗塌缩图表生命周期管理
│       │   └── useScreenScale.js         # 1920×1080 缩放自适应
│       ├── components/
│       │   ├── charts/BaseChart.vue      # ECharts 通用容器
│       │   ├── charts/BarChart.vue       # 柱状图封装
│       │   ├── charts/LineChart.vue      # 折线图封装
│       │   └── map/MapContainer.vue      # 世界地图底图
│       └── views/dashboard/
│           ├── index.vue                 # 仪表板 CSS Grid 主视图
│           └── components/
│               ├── HeaderTitle.vue       # 顶部标题栏
│               ├── LeftPanel.vue         # 港口吞吐量 Top10
│               ├── RouteCapacity.vue     # 航线运力分布
│               └── ShippingIndex.vue     # BDI 多维指数走势
```

---

## 🎨 设计语言

- **极简黑金高对比度** — 深色背景 + 青金色调数据可视化，降噪网格线
- **1920×1080 固定画布** — `useScreenScale` 组合式函数驱动等比缩放，适配任意物理分辨率
- **抗塌缩 ECharts 容器** — 基于 `ResizeObserver` + `pendingOptions` 缓存的零尺寸防御链

---

## 📄 协议

MIT Licensed · 2025 航运大数据课设项目
