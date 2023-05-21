import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { parse as csvParse } from "csv-parse/sync";
import { readFile } from "fs/promises";
import { Database } from "sqlite3";

export default async function createDB(dbName: string, outputDir: string) {
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(dbName);
  return new Promise((resolve, reject) => {
    (async () => {
      const createTableSQLs = (await readFile("./src/apiUtil/create_table.sql"))
        .toString()
        .replace(/\n/g, "")
        .split(";");
      db.serialize(() => {
        for (const sql of createTableSQLs) {
          db.run(sql, (_err) => {});
        }
      });
      await imporFromtCsv(db, "arknights", "./assets/arknights.csv");
      await imporFromtCsv(db, "bluearchive", "./assets/bluearchive.csv");
      await imporFromtCsv(
        db,
        "imas_cinderella",
        "./assets/imas_cinderella.csv"
      );
    })().then(() => {
      db.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        const outputTarget = path.resolve(outputDir);
        if (outputTarget !== process.cwd()) {
          try {
            fs.mkdirSync(outputDir);
          } catch {}
          const outputPath = path.join(outputTarget, dbName);
          fs.cpSync(dbName, outputPath);
          console.log("rename", outputPath);
        }
        resolve(outputTarget);
      });
    });
  });
}

async function imporFromtCsv(
  db: Database,
  tableName: string,
  csvPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    (async () => {
      const csv = await readFile(csvPath);
      let records: string[][] = csvParse(csv, {
        delimiter: ",",
        columns: false,
      });

      // カラム名の行を削除
      records = records.slice(1);
      try {
        db.serialize(() => {
          const state = db.prepare(
            `insert or ignore into ${tableName} (cv_name, cv_name_read, chara, chara_read) values (?, ?, ?, ?)`
          );
          // placeholder への適用
          records.forEach((row) => state.run([row[0], row[1], row[2], row[3]]));
          state.finalize(function (err) {
            if (err) {
              console.error("db.run", err);
              reject(err);
              return;
            }
          });
        });
      } catch (e) {
        console.error(e);
      }
    })().then(resolve);
  });
}

export async function tablesExists(dbName: string): Promise<boolean> {
  const db = new sqlite3.Database(dbName);
  return new Promise((resolve) => {
    let allExists = true;
    db.serialize(() => {
      db.run("select count(*) from arknights", (err) => {
        allExists = !err;
      });
      db.run("select count(*) from bluearchive", (err) => {
        allExists = !err;
      });
      db.run("select count(*) from imas_cinderella", (err) => {
        allExists = !err;
      });
    });
    db.close();
    resolve(allExists);
  });
}
