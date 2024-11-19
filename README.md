# 项目依赖

```bash
Vue.js + Vite + typescript+ Pnpm + pinia + axios + koa + sqlite + TailwindCSS + Vue Router 
```

# 项目结构

```bash
novel-site/
├── package.json
├── vite.config.ts
├── index.ts           # Koa 入口文件
├── src/
│   ├── client/       # 前端 Vue 代码
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── components/
│   │   └── views/
│   └── server/       # 后端  代码
│       ├── routes/
│       ├── models/
│       └── middleware/
├── public/           # 静态资源
└── database.sqlite   # SQLite 数据库文件
```

# 数据库结构

```sql
CREATE TABLE "books" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键id
  "file_name" TEXT NOT NULL,   --文件名
  "title" TEXT NOT NULL,   -- 书名
  "author" TEXT NOT NULL,  --作者
  "file_size" INTEGER NOT NULL,  --文件大小
  "md5" TEXT NOT NULL,   -- 文件md5
  "new_file_name" TEXT NOT NULL,  --新的文件名
  "cover" TEXT,   --封面
  "intro" TEXT,   -- 简介
  "parts" TEXT,   -- 模糊搜索关键字
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,  --创建时间
  "file_url" TEXT,    --文件下载地址
  "sort" TEXT,   -- 分类
  "type" TEXT,    -- 状态
  "tag" TEXT,    -- 书籍标签 
  UNIQUE ("md5" ASC)  
);

-- 评分类型表
CREATE TABLE "rating_types" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,        -- 评级名称:仙草/粮草等
  "description" TEXT,          -- 评级描述 
  "level" INTEGER NOT NULL,    -- 评级等级:5/4/3/2/1
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 匿名评价表
CREATE TABLE "book_ratings" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "book_id" INTEGER NOT NULL REFERENCES books(id),
  "rating_type_id" INTEGER NOT NULL REFERENCES rating_types(id), -- 评价类型
  "comment" TEXT,              -- 评价内容
  "ip" TEXT,                   -- 评价者IP(可选)
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rating_types (name, description, level) VALUES
('仙草', '非常好看,值得反复阅读', 5),
('粮草', '好看,值得一读', 4), 
('干草', '一般,可以打发时间', 3),
('枯草', '不好看,不推荐', 2),
('毒草', '极差,不建议阅读', 1);
```

# 开发任务看板

## 前端页面
- [ ] 首页
  - [ ] 书籍列表展示
  - [ ] 分类导航
  - [ ] 搜索功能
  - [ ] 最新上传
  - [ ] 评分排行

- [ ] 书籍详情页
  - [ ] 基本信息展示(封面、作者、简介等)
  - [ ] 下载功能
  - [ ] 评分系统
  - [ ] 匿名评论区
  - [ ] 相关书籍推荐

- [ ] 分类页面
  - [ ] 按分类筛选
  - [ ] 标签筛选
  - [ ] 排序功能(最新/评分/下载量)

- [ ] 搜索结果页
  - [ ] 关键词搜索
  - [ ] 高级筛选
  - [ ] 结果排序

- [ ] 关于页面
  - [ ] 网站介绍
  - [ ] 免责声明

## 后端功能

- [ ] 用户系统
  - [ ] IP限制
  - [ ] 访问统计

- [ ] 书籍管理
  - [ ] 文件上传
  - [ ] 自动提取书籍信息
  - [ ] 封面生成/上传
  - [ ] 文件去重(MD5)

- [ ] API接口
  - [ ] 书籍列表接口
  - [ ] 书籍详情接口
  - [ ] 搜索接口
  - [ ] 评分接口
  - [ ] 评论接口
  - [ ] 下载接口

- [ ] 数据库
  - [ ] 书籍信息表
  - [ ] 评分类型表
  - [ ] 评价记录表

## 其他功能

- [ ] 文件存储系统
  - [ ] 本地存储
  - [ ] 文件命名规范
  - [ ] 目录结构优化

- [ ] 性能优化
  - [ ] 前端缓存
  - [ ] 后端缓存
  - [ ] 图片懒加载
  - [ ] 分页加载

- [ ] 部署相关
  - [ ] Docker配置
  - [ ] CI/CD配置
  - [ ] 监控告警