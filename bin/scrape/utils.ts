import fetch from "isomorphic-fetch";
import { JSDOM } from "jsdom";
import { Database } from "sqlite3";

export async function fetchPage(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const dom = parser.parseFromString(text, "text/html");

  return dom;
}

export async function getVoiceActorReadFromWikipedia(actor: string) {
  const url = encodeURI(`https://ja.wikipedia.org/wiki/${actor}`);
  const dom = await fetchPage(url);

  const elms = Array.from(dom.querySelectorAll(".mw-parser-output"));
  const elm = elms[elms.length - 1];
  const textContent = elm?.textContent;
  if (!textContent) {
    return "";
  }

  const matches = textContent.match(new RegExp(`${actor[0]}.+（([^、）]+)`));
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return "";
}

export async function execQuery<T = any>(
  db: Database,
  sql: string,
  params: unknown = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });
}
