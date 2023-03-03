import * as sqlite3 from "sqlite3";
import path from "path";

const dbName = process.env["SQLITE_DB_NAME"] ?? "cv.db";
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
  if (db == null) {
    console.log("cwd: ", process.cwd());
    if (process.env.NODE_ENV === "development") {
      const sqlite = sqlite3.verbose();
      db = new sqlite.Database(path.join(process.cwd(), dbName));
      db.on("trace", (sql) => console.log(sql));
    } else {
      db = new sqlite3.Database(path.join(process.cwd(), dbName));
    }
    db.on("error", (err) => console.error(err));
  }
}
