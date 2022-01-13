/* eslint-disable */
const { Analyzer, Dictionary, sort_map } = require("textual-data-analysis");

const text = `
自然語言處理（英語：Natural Language Processing，縮寫作 NLP）是人工智慧和語言學領域的分支學科。此領域探討如何處理及運用自然語言；自然語言處理包括多方面和步驟，基本有認知、理解、生成等部分。

自然語言認知和理解是讓電腦把輸入的語言變成有意思的符號和關係，然後根據目的再處理。自然語言生成系統則是把計算機數據轉化為自然語言。
`;

const analyzer = new Analyzer(text).split(Dictionary.english_letters).split(Dictionary.punctuations);

console.log(sort_map(analyzer.ngram(4)));
console.log(sort_map(analyzer.count(["自然語言處理", "自然", "語言"])));
console.log(sort_map(analyzer.meaningful()));
