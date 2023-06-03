import {
  isValidOrReponseError,
  responseError,
  responseOk,
} from "@/apiUtil/createResponse";
import type { NextApiRequest, NextApiResponse } from "next";
import * as t from "io-ts";
import all from "@/apiUtil/db";
import { CVEntity } from "@/entity/CVEntity";

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
  const filterTableNames = Array.isArray(databaseQuery)
    ? databaseQuery
    : databaseQuery?.split(",") ?? [];

  if (!isValidOrReponseError(res, t.array(validateQuery), filterTableNames)) {
    return;
  }

  try {
    const rows = await getCV(filterTableNames);
    responseOk(res, rows);
  } catch (e) {
    console.error(e);
    if (isError(e)) {
      responseError(res, "InternalServerError", e.message, e);
    } else {
      responseError(res, "InternalServerError", "Unknwon error", e);
    }
  }
}

const targetTables = ["arknights", "bluearchive", "imas_cinderella"];

export async function getCV(tables: string[]): Promise<CVEntity[]> {
  const selectCharaAliases = targetTables
    .map(
      (table) =>
        ` ${table}.cv_name as ${table}_cv_name, ${table}.cv_name_read as ${table}_cv_name_read, ${table}.id as ${table}_id, ${table}.chara as ${table}_chara`
    )
    .join(", ");
  const joinOnPlaceHolder = targetTables
    .filter((_, i) => i >= 1)
    .map(
      (table) =>
        `full left join ${table} on ${targetTables[0]}.cv_name = ${table}.cv_name`
    )
    .join(" ");

  const filterPlaceHolder = tables
    .map((table) => `${table}_chara is not null`)
    .join(" and ");

  if (tables.length === 0) {
    const sql = `select ${selectCharaAliases} from ${targetTables[0]} ${joinOnPlaceHolder}`;
    const rows = await all(sql);
    return rows;
  } else {
    const sql = `select ${tables[0]}.cv_name, ${tables[0]}.cv_name_read, ${selectCharaAliases} from ${targetTables[0]} ${joinOnPlaceHolder} where ${filterPlaceHolder}`;
    const rows = await all(sql);
    return rows;
  }
}

function isError(e: any): e is Error {
  return e != null && "message" in e;
}
