アークナイツ声優ページから声優一覧だけ持ってくるセレクタ

```ts
e = Array.from(document.querySelectorAll("h4"));
e.map(v => v.textContent).filter(v => v.includes("†")).map(v => v.replace("†", "").trim());
```

声優 -> キャラ名の要素が親子関係でないのでどうにかする必要がある
