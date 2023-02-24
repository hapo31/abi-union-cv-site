import * as sqlite3 from "sqlite3";
import path from "path";
import { readdirSync } from "fs";

const dbName = process.env["SQLITE_DB_NAME"] ?? "cv.db";
const dbPath = process.env["OUTPUT_DIR"]
  ? path.resolve(process.cwd(), process.env["OUTPUT_DIR"], dbName)
  : path.resolve(process.cwd(), dbName);
let db: sqlite3.Database;

export default async function all<T = any>(
  sql: string,
  params: unknown = []
): Promise<T[]> {
  initDB();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });
}

function initDB() {
  if (process.env.NODE_ENV === "development") {
    const sqlite = sqlite3.verbose();
    db = new sqlite.Database(dbPath);
    db.on("trace", (sql) => console.log(sql));
  } else {
    console.log(
      `${readdirSync(
        path.resolve(process.cwd(), process.env["OUTPUT_DIR"] ?? ".")
      )}`
    );
    db = new sqlite3.Database(dbPath);
  }
  db.on("error", (err) => console.error(err));
}
