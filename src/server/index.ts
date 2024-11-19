import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { createConnection } from "./database";
import bookRoutes from "./routes/book";
import ratingRoutes from "./routes/rating";

console.log("Starting server initialization...");

async function startServer() {
  console.log("Creating Koa app instance...");
  const app = new Koa();

  // 中间件
  console.log("Setting up middleware...");
  app.use(cors());
  app.use(bodyParser());

  // 错误处理中间件
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      console.error("Error occurred:", err);
      ctx.status = err.status || 500;
      ctx.body = {
        code: ctx.status,
        message: err.message || "服务器内部错误",
      };
    }
  });

  try {
    // 初始化数据库连接
    console.log("Initializing database connection...");
    await createConnection();
    console.log("Database connection established successfully");

    // 路由
    console.log("Setting up routes...");
    app.use(bookRoutes.routes()).use(bookRoutes.allowedMethods());
    app.use(ratingRoutes.routes()).use(ratingRoutes.allowedMethods());
    console.log("Routes setup completed");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    throw err; // 让错误继续传播，这样可以在外层捕获
  }
}

// 启动服务器并添加全局错误处理
process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

console.log("Calling startServer function...");
startServer().catch((err) => {
  console.error("Fatal error during server startup:", err);
  process.exit(1);
});
