import { Analyzer } from "../analyzer";

describe("Analyzer with no initial value", () => {
    const analyzer = new Analyzer();

    test("length", () => {
        expect(analyzer.length).toBe(0);
    });

    test("ngram", () => {
        const ngrams = analyzer.ngram(3);
        expect(ngrams.size).toBe(0);
    });

    test("set", () => {
        analyzer.set("test");
        expect(analyzer.length).toBe(4);
    });
});

describe("Analyzer with initial value", () => {
    const text =
        "自然語言處理（英語：Natural Language Processing，縮寫作 NLP）是人工智慧和語言學領域的分支學科。此領域探討如何處理及運用自然語言；自然語言處理包括多方面和步驟，基本有認知、理解、生成等部分。";
    const analyzer = new Analyzer(text);

    test("length", () => {
        expect(analyzer.length).toBe(text.length);
    });

    test("ngram", () => {
        const ngrams = analyzer.ngram(4);
        expect(ngrams.size).toBe(103);
        expect(ngrams.get("自然")).toBe(undefined);
        expect(ngrams.get("自然語言")).toBe(3);
    });

    test("set", () => {
        const new_text = "文字分割是將書面文字分割成有意義單位的過程，通常是指把文字分割成詞語、句子、段落、節、章等。";
        analyzer.set(new_text);
        expect(analyzer.length).toBe(new_text.length);
    });
});
