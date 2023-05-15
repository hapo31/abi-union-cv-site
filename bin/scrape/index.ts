import fetch from "isomorphic-fetch";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

dotenv.config();

(async () => {
  const charList = await fetchCharList(
    encodeURI("https://arknights.wikiru.jp/?オペレーター実装履歴")
  );

  const dbCharResult = await all("select chara from arknights");
  const dbCharList: string[] = dbCharResult.map(({ chara }) => chara);

  for (const chara of dbCharList) {
    const index = charList.findIndex((c) => c === chara);
    if (index >= 0) {
      charList.splice(index, 1);
    }
  }

  const diffCharas = charList.filter((chara) => !chara.startsWith("*1"));

  const cvList: { chara: string; cv_name: string; cv_name_read: string }[] = [];

  for await (const chara of diffCharas) {
    const cv = await getVoiceActor(chara);
    const cvRead = await getVoiceActorRead(cv);

    cvList.push({
      chara,
      cv_name: cv,
      cv_name_read: cvRead,
    });
  }

  console.log(cvList);
})();

async function fetchCharList(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const dom = parser.parseFromString(text, "text/html");

  const elms = Array.from(
    dom.querySelectorAll("#sortabletable1 td.style_td a")
  );
  return elms.map((v) => v.textContent).filter((v): v is string => !!v);
}

async function getVoiceActor(chara: string) {
  const url = encodeURI(`https://arknights.wikiru.jp?${chara}`);
  const res = await fetch(url);
  const text = await res.text();
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const dom = parser.parseFromString(text, "text/html");

  const elm = dom.querySelector('td.style_td a[title="声優"]');

  return elm?.textContent ?? "";
}

async function getVoiceActorRead(actor: string) {
  const url = encodeURI(`https://ja.wikipedia.org/wiki/${actor}`);
  const res = await fetch(url);
  const text = await res.text();
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const dom = parser.parseFromString(text, "text/html");

  const elm = dom.querySelector(".mw-parser-output p");

  const textContent = elm?.textContent;
  if (!textContent) {
    return "";
  }
  const matches = text.match(new RegExp(`${actor[0]}.+（([^、）]+)`));
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return "";
}

async function all<T = any>(sql: string, params: unknown = []): Promise<T[]> {
  const db = new sqlite3.Database(process.env["SQLITE_DB_NAME"] ?? "cv.db");
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
