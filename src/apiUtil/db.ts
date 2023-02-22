import mysql from "mysql2/promise";

const host = process.env["MYSQL_HOST"];
const user = process.env["MYSQL_USER"];
const db = process.env["MYSQL_DATABASE"];
const password = process.env["MYSQL_PASSWORD"];

export default async function all<T = any>(
  sql: string,
  params: unknown = []
): Promise<T[]> {
  const connection = await mysql.createConnection(
    `mysql://${user}:${password}@${host}/${db}`
  );
  await connection.connect();
  try {
    const [rows] = await connection.execute(sql, [params]);
    return rows as T[]; // これでいいのかは知らね
  } finally {
    await connection.end();
  }
}
