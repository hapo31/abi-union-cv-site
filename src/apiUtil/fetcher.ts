import fetch from "isomorphic-fetch";

export default async function fetcher(...args: any[]) {
  // @ts-ignore
  const res = await fetch(...args);

  return res.json();
}
