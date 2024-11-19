import Router from "@koa/router";
import { DefaultState, Context } from "koa";
import { getConnection } from "../database";
import { BookQuery } from "../types";

const router = new Router<DefaultState, Context>();

router.prefix("/api/books");

// 获取书籍列表
router.get("/", async (ctx) => {
  const db = getConnection();
  const {
    page = 1,
    limit = 10,
    sort = "created_at",
    category,
    keyword,
  } = ctx.query as BookQuery;

  try {
    let query = "SELECT * FROM books WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND sort = ?";
      params.push(category);
    }

    if (keyword) {
      query += " AND (title LIKE ? OR author LIKE ? OR parts LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // 计算总数
    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM (${query})`,
      params
    );
    const total = countResult.total;

    // 添加排序和分页
    query += ` ORDER BY ${sort} DESC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    const books = await db.all(query, params);

    ctx.body = {
      code: 200,
      data: {
        list: books,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "服务器错误",
    };
  }
});

// 获取书籍详情
router.get("/:id", async (ctx) => {
  const db = getConnection();
  const { id } = ctx.params;

  try {
    const book = await db.get("SELECT * FROM books WHERE id = ?", id);
    if (!book) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: "书籍不存在",
      };
      return;
    }

    // 获取书籍评分
    const ratings = await db.all(
      `
      SELECT r.*, rt.name as rating_name, rt.level 
      FROM book_ratings r
      LEFT JOIN rating_types rt ON r.rating_type_id = rt.id
      WHERE r.book_id = ?
    `,
      id
    );

    ctx.body = {
      code: 200,
      data: {
        ...book,
        ratings,
      },
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
