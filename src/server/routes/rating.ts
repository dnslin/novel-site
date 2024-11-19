import Router from "@koa/router";
import { getConnection } from "../database";
import { DefaultState, Context } from "koa";

interface RatingBody {
  book_id: number;
  rating_type_id: number;
  comment?: string;
}

const router = new Router<DefaultState, Context>();

router.prefix("/api/ratings");

// 获取评分类型列表
router.get("/types", async (ctx) => {
  const db = getConnection();

  try {
    const types = await db.all(
      "SELECT * FROM rating_types ORDER BY level DESC"
    );
    ctx.body = {
      code: 200,
      data: types,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "服务器错误",
    };
  }
});

// 添加书籍评分
router.post("/", async (ctx) => {
  const db = getConnection();
  const { book_id, rating_type_id, comment } = ctx.request.body as RatingBody;
  const ip = ctx.ip;

  try {
    // 验证必填字段
    if (!book_id || !rating_type_id) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: "缺少必要参数",
      };
      return;
    }

    // 检查是否已经评价过
    const exists = await db.get(
      "SELECT id FROM book_ratings WHERE book_id = ? AND ip = ?",
      [book_id, ip]
    );

    if (exists) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: "您已经评价过这本书了",
      };
      return;
    }

    // 添加评分
    await db.run(
      "INSERT INTO book_ratings (book_id, rating_type_id, comment, ip) VALUES (?, ?, ?, ?)",
      [book_id, rating_type_id, comment, ip]
    );

    ctx.body = {
      code: 200,
      message: "评分成功",
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "服务器错误",
    };
  }
});

export default router;
