import dotenv from "dotenv";
import arknightsIndex from "./arknights";
import sqlite3 from "sqlite3";

dotenv.config();

(async () => {
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(process.env["SQLITE_DB_NAME"] ?? "cv.db");
  const arknightsList = await arknightsIndex(db);
  console.log(arknightsList);
})();
