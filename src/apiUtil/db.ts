import path from "path";
import * as sqlite3 from "sqlite3";
import getConfig from "next/config";
import type Config from "../../next.config";

const { distDir }: typeof Config = getConfig();

const sqlite = sqlite3.verbose();

const dbName = path.resolve(
  distDir ?? "",
  process.env["SQLITE_DB_NAME"] ?? "cv.db"
);

const db = new sqlite.Database(dbName);

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
