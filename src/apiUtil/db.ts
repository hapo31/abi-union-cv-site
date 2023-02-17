import console from "console";
import * as fs from "fs/promises";
import path from "path";
import * as sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();

const dbName = process.env["SQLITE_DB_NAME"] ?? "cv.db";

let db: sqlite3.Database;
try {
  db = new sqlite.Database(dbName);
} catch (e) {
  const pwd = process.cwd();

  const files = await fs.readdir(pwd);
  const dirs = files.filter(async (f) =>
    (await fs.stat(path.join(pwd, f))).isDirectory()
  );
  console.error(e);
  console.error(dirs.join("\n"));
  process.exit(1);
}

if (process.env.NODE_ENV === "development") {
  db.on("trace", (sql) => console.log(sql));
}
db.on("error", (err) => console.error(err));

export default async function all<T = any>(
  sql: string,
  params: unknown = []
): Promise<T[]> {
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
