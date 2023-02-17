import console from "console";
import * as fs from "fs/promises";
import path from "path";
import * as sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();

const dbName = path.join(
  process.cwd(),
  process.env["SQLITE_DB_NAME"] ?? "cv.db"
);
const db = new sqlite.Database(":memory:");

if (process.env.NODE_ENV === "development") {
  db.on("trace", (sql) => console.log(sql));
}
db.on("error", (err) => console.error(err));

export default async function all<T = any>(
  sql: string,
  params: unknown = []
): Promise<T[]> {
  const pwd = process.cwd();
  const files = await fs.readdir(pwd);

  files.push(
    ...(await Promise.all(
      files.map(async (file) =>
        (await fs.stat(path.join(pwd, file))).isDirectory() &&
        file !== "node_modules"
          ? "L" + (await fs.readdir(path.join(pwd, file))).join("/")
          : path.join(pwd, file)
      )
    ))
  );

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql, params, (err, row) => {
        if (err) {
          reject({ err, files });
        } else {
          resolve(row);
        }
      });
    });
  });
}
