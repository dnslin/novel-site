# 项目依赖

```bash
Vue.js + Vite + typescript+ Pnpm + pinia + axios + koa + sqlite + TailwindCSS + Vue Router 
```

# 项目结构

```bash
novel-site/
├── package.json
├── vite.config.js
├── index.js           # Koa 入口文件
├── src/
│   ├── client/       # 前端 Vue 代码
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── components/
│   │   └── views/
│   └── server/       # 后端 Koa 代码
│       ├── routes/
│       ├── models/
│       └── middleware/
├── public/           # 静态资源
└── database.sqlite   # SQLite 数据库文件
```