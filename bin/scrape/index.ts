import fetch from "isomorphic-fetch";
import {JSDOM} from "jsdom"

(async () => {
    const res = await fetchCharList(encodeURI("https://arknights.wikiru.jp/?オペレーター実装履歴"))
    console.log(res);
})();



async function fetchCharList(url: string) {
    const res = await fetch(url);
    const text = await res.text();
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const dom = parser.parseFromString(text, "text/html");

    const elms = Array.from(dom.querySelectorAll("#sortabletable1 td.style_td a"));
    return elms.map((v => v.textContent)).filter((v): v is string => !!v);
}