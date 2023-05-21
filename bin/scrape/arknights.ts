import { Database } from "sqlite3";
import { execQuery, fetchPage, getVoiceActorReadFromWikipedia } from "./utils";

export default async function arknightsIndex(db: Database) {
  const charList = await fetchCharList(
    encodeURI("https://arknights.wikiru.jp/?オペレーター実装履歴")
  );

  const dbCharResult = await execQuery(db, "select chara from arknights");
  const dbCharList: string[] = dbCharResult.map(({ chara }) => chara);

  for (const chara of dbCharList) {
    const index = charList.findIndex((c) => c === chara);
    if (index >= 0) {
      charList.splice(index, 1);
    }
  }

  const diffCharas = charList.filter((chara) => !chara.startsWith("*1"));

  const cvList = await Promise.all(
    diffCharas.map(async (chara) => {
      const cv = await getVoiceActor(chara);
      const cvRead = await getVoiceActorReadFromWikipedia(cv);

      return {
        chara,
        cv_name: cv,
        cv_name_read: cvRead,
      };
    })
  );

  return cvList;
}

async function fetchCharList(url: string) {
  const dom = await fetchPage(url);

  const elms = Array.from(
    dom.querySelectorAll("#sortabletable1 td.style_td a")
  );
  return elms.map((v) => v.textContent).filter((v): v is string => !!v);
}

async function getVoiceActor(chara: string) {
  const url = encodeURI(`https://arknights.wikiru.jp?${chara}`);
  const dom = await fetchPage(url);

  const elm = dom.querySelector('td.style_td a[title="声優"]');

  return elm?.textContent ?? "";
}
