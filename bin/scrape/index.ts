import dotenv from "dotenv";
import arknightsIndex from "./arknights";
import sqlite3, { Database } from "sqlite3";
import { execQuery } from "./utils";

dotenv.config();

(async () => {
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(process.env["SQLITE_DB_NAME"] ?? "cv.db");
  const arknightsList = await arknightsIndex(db);

  const placeholder = arknightsList
    .map((_, i) => `($cv_name${i}, $cv_name_read${i}, $chara${i})`)
    .join(",");
  await execQuery(
    db,
    `replace into arknights (cv_name, cv_name_read, chara) values ${placeholder}`,
    arknightsList
      .map((record, i) => ({
        [`$cv_name${i}`]: record.cv_name,
        [`$cv_name_read${i}`]: record.cv_name_read,
        [`$chara${i}`]: record.chara,
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  );
})();
