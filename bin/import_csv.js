const mysql = require("mysql2/promise");
const csvParse = require("csv-parse");
const dotenv = require("dotenv");
const { readFile } = require("fs/promises");

(async () => {
  const stage = process.env.STAGE;

  dotenv.config({
    path: stage ? `.env.${stage}` : ".env"
  });

  const host = process.env["MYSQL_HOST"];
  const user = process.env["MYSQL_USER"];
  const db = process.env["MYSQL_DATABASE"];
  const password = process.env["MYSQL_PASSWORD"];

  const createTableSQL = (await readFile("./bin/create_table.sql")).toString().replaceAll("\n", "").replaceAll("  ", " ");
  const connection = await mysql.createConnection(`mysql://${user}:${password}@${host}/${db}`);
  await connection.connect();

  try {
    connection.execute(createTableSQL);
    await imporFromtCsv(connection, "arknights", "./assets/arknights.csv");
    await imporFromtCsv(connection, "bluearchive", "./assets/bluearchive.csv");
    await imporFromtCsv(connection, "imas_cinderella", "./assets/imas_cinderella.csv");
  } catch (e) {
    console.error(e);
  } finally {
    await connection.end();
  }

})().catch(e => console.error(e));

/**
 * 
 * @param {import("mysql2/promise").Connection} connection 
 * @param {string} tableName 
 * @param {string} csvPath 
 * @returns
 */
async function imporFromtCsv(connection, tableName, csvPath) {
  return new Promise(async (resolve, reject) => {
    const csv = await readFile(csvPath);
    const parser = csvParse.parse({ delimiter: ",", columns: false });
    /**
     * @type string[][]
     **/
    let records = [];

    parser.on("readable", async () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
      // カラム名の行を削除
      records = records.slice(1);

      // placeholder への適用
      const values = records.map(row => [row[0], row[1], row[2], row[3]])
      try {
        await connection.query(`insert or ignore into ${tableName} (cv_name, cv_name_read, chara, chara_read) values (??, ??, ??, ??)`, [values]);
        resolve();
      } catch (err) {
        reject(err);
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