import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function createConnection() {
  if (db) return db;

  try {
    console.log("Opening database connection...");
    const dbPath = path.resolve(process.cwd(), "books.db");
    console.log("Database path:", dbPath);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Testing database connection...");
    const test = await db.get("SELECT 1 as test");
    console.log("Database connection test result:", test);

    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export function getConnection(): Database {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}
