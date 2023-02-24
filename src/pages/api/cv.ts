import {
  isValidOrReponseError,
  responseError,
  responseOk,
} from "@/apiUtil/createResponse";
import type { NextApiRequest, NextApiResponse } from "next";
import * as t from "io-ts";
import all from "@/apiUtil/db";
import { outputDirTree } from "@/util/debug";

const validateQuery = t.keyof({
  arknights: null,
  bluearchive: null,
  imas_cinderella: null,
});

export type GameType = t.TypeOf<typeof validateQuery>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const databaseQuery = req.query["database"];

  const targetTables = ["arknights", "bluearchive", "imas_cinderella"];

  const filterTableNames = Array.isArray(databaseQuery)
    ? databaseQuery
    : databaseQuery?.split(",") ?? [];

  if (!isValidOrReponseError(res, t.array(validateQuery), filterTableNames)) {
    return;
  }

  return responseOk(res, outputDirTree("/var"));

  // try {
  //   const selectCharaAliases = targetTables
  //     .map(
  //       (table) =>
  //         ` ${table}.cv_name as ${table}_cv_name, ${table}.cv_name_read as ${table}_cv_name_read, ${table}.id as ${table}_id, ${table}.chara as ${table}_chara`
  //     )
  //     .join(", ");
  //   const joinOnPlaceHolder = targetTables
  //     .filter((_, i) => i >= 1)
  //     .map(
  //       (table) =>
  //         `left outer join ${table} on ${targetTables[0]}.cv_name = ${table}.cv_name`
  //     )
  //     .join(" ");

  //   const filterPlaceHolder = filterTableNames
  //     .map((table) => `${table}_chara is not null`)
  //     .join(" and ");

  //   if (filterTableNames.length === 0) {
  //     const sql = `select ${selectCharaAliases} from ${targetTables[0]} ${joinOnPlaceHolder}`;
  //     const rows = await all(sql);
  //     responseOk(res, rows);
  //   } else {
  //     const sql = `select ${filterTableNames[0]}.cv_name, ${filterTableNames[0]}.cv_name_read, ${selectCharaAliases} from ${targetTables[0]} ${joinOnPlaceHolder} where ${filterPlaceHolder}`;
  //     const rows = await all(sql);
  //     responseOk(res, rows);
  //   }
  // } catch (e) {
  //   if (isError(e)) {
  //     responseError(res, "InternalServerError", e.message, e);
  //   } else {
  //     responseError(res, "InternalServerError", "Unknwon error", e);
  //   }
  // }
}

function isError(e: any): e is Error {
  return e != null && "message" in e;
}
