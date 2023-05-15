import path from "path";
import * as sqlite3 from "sqlite3";
import getConfig from "next/config";
import type Config from "../../next.config";
import fs from "fs/promises";
import fetch from "isomorphic-fetch";
import { Database } from "sqlite3";

const { distDir }: typeof Config = getConfig() ?? {};

const sqlite = sqlite3.verbose();

const dbName = path.resolve(
  distDir ?? "",
  process.env["SQLITE_DB_NAME"] ?? "cv.db"
);

const dbUrl = process.env["SQLITE_URL"] ?? "";

let db: Database | null = null;

export default async function all<T = any>(
  sql: string,
  params: unknown = []
): Promise<T[]> {
  const db = await fetchDB();
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

async function fetchDB() {
  try {
    await fs.stat(dbName);
    if (db == null) {
      throw new Error("can not initialize");
    }
    return db;
  } catch {
    const res = await fetch(dbUrl);
    const buffer = await res.arrayBuffer();
    fs.writeFile(dbName, new DataView(buffer));
    return (db = new sqlite.Database(dbName));
  }
}
