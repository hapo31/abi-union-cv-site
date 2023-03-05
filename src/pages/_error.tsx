import { type NextPageContext } from "next";
import ErrorPage, { type ErrorProps } from "next/error";

export default function Error(props: ErrorProps) {
  return <ErrorPage {...props} />;
}

export const getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res
    ? res.statusCode
    : err?.statusCode
    ? err.statusCode
    : 404;
  return { statusCode };
};
