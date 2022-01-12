# Textual Data Analysis

文字分析

```javascript
const { Analyzer, Dictionary } = require("textual-data-analysis");

const text = `
自然語言處理（英語：Natural Language Processing，縮寫作 NLP）是人工智慧和語言學領域的分支學科。此領域探討如何處理及運用自然語言；自然語言處理包括多方面和步驟，基本有認知、理解、生成等部分。

自然語言認知和理解是讓電腦把輸入的語言變成有意思的符號和關係，然後根據目的再處理。自然語言生成系統則是把計算機數據轉化為自然語言。
`;

const analyzer = new Analyzer(text)
    .ignore(Dictionary.english_letters)
    .split(Dictionary.punctuations);

console.log(analyzer.ngram(4));
/*
Map(91) {
  '自然語言' => 6,
  '然語言處' => 2,
  '語言處理' => 2,
  ...
}
*/

console.log(analyzer.count(["自然語言處理", "自然", "語言"]));
/*
Map(3) { '自然語言處理' => 2, '語言' => 6, '自然' => 4 }
*/

console.log(analyzer.meaningful());
/*
Map(8) {
  '自然語言處理' => 2,
  '自然語言' => 4,
  '語言' => 2,
  '領域' => 2,
  '處理' => 2,
  '認知' => 2,
  '理解' => 2,
  '生成' => 2
}
*/
```

## Features

- N-gram
- 權威詞統計
- 有意詞統計
