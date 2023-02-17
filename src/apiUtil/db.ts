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
  const files = await fileStat(pwd);
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

async function fileStat(current: string = process.cwd()) {
  if (current.startsWith(".")) {
    return "";
  }

  const files = await fs.readdir(current);

  if (files.length === 0) {
    return "";
  }

  const results: Array<string | Record<string, unknown>> = files.slice();

  for (const file of files) {
    if (file === "node_modules") {
      continue;
    }
    if (file === process.env["SQLITE_DB_NAME"]) {
      return files;
    }

    const nextPath = path.join(current, file as string);
    const stat = await fs.stat(nextPath);
    if (stat.isDirectory()) {
      results.push({ [file as string]: await fileStat(nextPath) });
    }
  }

  return results;
}
