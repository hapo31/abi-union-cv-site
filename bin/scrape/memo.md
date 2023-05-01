# アイデアメモ

## 案1(没)  アークナイツ声優ページから声優一覧だけ持ってくる
セレクタ

```ts
e = Array.from(document.querySelectorAll("h4"));
e.map(v => v.textContent).filter(v => v.includes("†")).map(v => v.replace("†", "").trim());
```

声優 -> キャラ名の要素が親子関係でないのでどうにかする必要がある

## 案2 実装履歴ページからキャラ名だけ引っ張ってきて各ページを跨いでスクレイピング

1. 実装履歴ページからキャラ名だけ引っ張ってくる

```ts
document.querySelectorAll("#sortabletable1 td.style_td a")
```

2. DBにあるデータとの差分を取って取得するべきページのURL一覧を得る
```ts
const charas = [...]
const sql = `select * from arknights`
...
const diffList = result.map(...)
const urls = diffList.map(v => `https://arknights.wikiru.jp?${encodeURIComponent(v)}`)
```

3. url 先から声優名を取ってくる

```ts
document.querySelector("td.style_td a[title=\"声優\"]")
```

4. wikipedia から声優の読みを持ってくる
```ts
// 備考: ここうまく作れば汎用的に使えそう
const actorName = ...
const page = await fetch(...);
const pageDOM = page.hoge(...)
const text = pageDOM.querySelector(".mw-parser-output p").textContent
// 声優名の一文字目でマッチすれば苗字と名前の間に空白文字があってもマッチするはず
const matches = text.match(new Regex(`${actorName[0]}.+（([^、]+)`))
if (matches.length > 2) {
    // success
}
// 取得に失敗しても全体を失敗にはしないで読みを空にする感じで
```
