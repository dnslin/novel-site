import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { createConnection } from "./database";
import bookRoutes from "./routes/book";
import ratingRoutes from "./routes/rating";

const app = new Koa();

// 中间件
app.use(cors());
app.use(bodyParser());

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      code: ctx.status,
      message: err.message || "服务器内部错误",
    };
  }
});

// 初始化数据库连接
createConnection().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

// 路由
app.use(bookRoutes.routes()).use(bookRoutes.allowedMethods());
app.use(ratingRoutes.routes()).use(ratingRoutes.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
