const sqlite3 = require("sqlite3").verbose();
const csvParse = require("csv-parse");
const dotenv = require("dotenv");
const { readFile } = require("fs/promises");
const path = require("path");
const { Database } = require("sqlite3");
const fs = require("fs/promises");

(async () => {
  const stage = process.env.STAGE;

  dotenv.config({
    path: stage ? `.env.${stage}` : ".env"
  });

  const dbName = path.join(process.cwd(), process.env["SQLITE_DB_NAME"]);

  try {
    const parent = path.dirname(dbName);
    fs.mkdir(parent, { recursive: true });
  } catch {
  }

  const createTableSQLs = (await readFile("./bin/create_table.sql")).toString().split("\n");
  const db = new sqlite3.Database(dbName);

  createTableSQLs.forEach(sql => {
    db.run(sql, (_err) => {
    });
  })

  await imporFromtCsv(db, "arknights", "./assets/arknights.csv");
  await imporFromtCsv(db, "bluearchive", "./assets/bluearchive.csv");
  await imporFromtCsv(db, "imas_cinderella", "./assets/imas_cinderella.csv");


  db.close();
})();

/**
 * 
 * @param {Database} db 
 * @param {string} tableName 
 * @param {string} csvPath 
 * @returns
 */
async function imporFromtCsv(db, tableName, csvPath) {
  return new Promise(async (resolve, reject) => {
    const csv = await readFile(csvPath);
    const parser = csvParse.parse({ delimiter: ",", columns: false });
    /**
     * @type string[][]
     **/
    let records = [];

    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
      // カラム名の行を削除
      records = records.slice(1);

      try {
        db.serialize(() => {
          const state = db.prepare(`insert or ignore into ${tableName} (cv_name, cv_name_read, chara, chara_read) values (?, ?, ?, ?)`);
          // placeholder への適用
          records.forEach(row => state.run([row[0], row[1], row[2], row[3]]));
          state.finalize(function (err) {
            if (err) {
              console.error("db.run", err);
              reject(err);
              return;
            }
            resolve();
          });
        });
      } catch (e) {
        console.error(e);
        resolve();
      }
    });

    parser.on("end", () => {

    });

    parser.on("error", (err) => {
      reject(err);
    });

    parser.write(csv);

  });
}