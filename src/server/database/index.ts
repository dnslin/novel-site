import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function createConnection() {
  if (db) return db;

  try {
    db = await open({
      filename: path.resolve(process.cwd(), "book.db"),
      driver: sqlite3.Database,
    });

    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export function getConnection(): Database {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}
