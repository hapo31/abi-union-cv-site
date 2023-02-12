import {
  isValidOrReponseError,
  responseError,
  responseOk,
} from "@/apiUtil/createResponse";
import type { NextApiRequest, NextApiResponse } from "next";
import * as t from "io-ts";
import all from "@/apiUtil/db";

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

  if (databaseQuery == null || databaseQuery.length === 0) {
    responseError(
      res,
      "BadRequest",
      "At least one of 'arknights' 'bluearchive' 'imas_cinderella' must be specified in 'database' query"
    );
    return;
  }

  const targetTableNames = Array.isArray(databaseQuery)
    ? databaseQuery
    : databaseQuery.split(",");

  if (!isValidOrReponseError(res, t.array(validateQuery), targetTableNames)) {
    return;
  }

  try {
    if (targetTableNames.length === 1) {
      const rows = await all(`select * from ${targetTableNames[0]}`);
      responseOk(res, rows);
    } else {
      const selectCharaAliases = targetTableNames
        .map((table) => `${table}.chara as ${table}_chara`)
        .join(", ");
      const joinOnPlaceHolder = targetTableNames
        .filter((_, i) => i >= 1)
        .map(
          (table) =>
            `inner join ${table} on ${targetTableNames[0]}.cv_name = ${table}.cv_name`
        )
        .join(" ");

      const rows = await all(
        `select ${targetTableNames[0]}.id, ${targetTableNames[0]}.cv_name, ${targetTableNames[0]}.cv_name_read, ${selectCharaAliases} from ${targetTableNames[0]} ${joinOnPlaceHolder}`
      );
      responseOk(res, rows);
    }
  } catch (e) {
    if (isError(e)) {
      responseError(res, "InternalServerError", e.message, e);
    } else {
      responseError(res, "InternalServerError", "Unknwon error", e);
    }
  }
}

function isError(e: any): e is Error {
  return e != null && "message" in e;
}
