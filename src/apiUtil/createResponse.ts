import { Type } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { NextApiResponse } from "next";

const HttpStatus = {
  OK: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
};

export type HttpStatus = keyof typeof HttpStatus;

export function responseError(
  res: NextApiResponse,
  status: HttpStatus,
  reason: string,
  params?: unknown
) {
  const response: ErrorResponse = {
    error: reason,
    params,
  };
  res.status(HttpStatus[status]).json(response);
}

export function responseOk(
  res: NextApiResponse,
  payload: unknown,
  status: HttpStatus = "OK"
) {
  const response: Response<unknown> = {
    payload,
  };
  res.status(HttpStatus[status]).json(response);
}

export function isValidOrReponseError<A, O, I = unknown>(
  res: NextApiResponse,
  validator: Type<A, O, I>,
  values: I
): boolean {
  if (!validator.is(values)) {
    const result = PathReporter.report(validator.decode(values));
    responseError(res, "BadRequest", "Value format error", { errors: result });
    return false;
  }

  return true;
}

export type Response<T> = {
  payload: T;
};

export type ErrorResponse = {
  error: string;
  params: unknown;
};
