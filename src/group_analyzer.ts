import { AnalyzerPrototype } from "./prototype";
import { Analyzer } from "./analyzer";

export class GroupAnalyzer extends AnalyzerPrototype {
    public texts: string[] = [];

    constructor(texts: Set<string> | string[] = [], case_sensitive = false) {
        super(case_sensitive);
        this.set(texts);
    }

    /**
     * Set the texts in the analyzer
     * @param texts The texts to set
     * @returns The group analyzer
     */
    public set(texts: Set<string> | string[]): this {
        this.texts = [...texts];
        return this;
    }

    /**
     * Add a text to the analyzer
     * @param text The text to add
     * @returns The group analyzer
     */
    public add(text: string): this {
        this.texts.push(text);
        return this;
    }

    /**
     * Clear the texts in the analyzer
     * @returns The group analyzer
     */
    public clear(): this {
        this.texts = [];
        return this;
    }

    /**
     * Get ignored and splitted segments of the texts in the analyzer
     * @returns The array of segments that has been ignored and splitted
     */
    public segments(): string[][] {
        return this.texts.map((text) => {
            const analyzer = new Analyzer(text, this._case);
            analyzer.ignore(this._ignore);
            analyzer.split(this._split);
            return analyzer.segments();
        });
    }

    /**
     * N-grams of the texts in the analyzer
     * @param n The n-gram size
     * @returns A Map of slices and their counts
     */
    public ngram(n: number): Map<string, number> {
        return this.texts.reduce((map, text) => {
            const analyzer = new Analyzer(text, this._case);
            analyzer.ignore(this._ignore);
            analyzer.split(this._split);
            analyzer.ngram(n).forEach((count, slice) => {
                map.set(slice, (map.get(slice) || 0) + count);
            });
            return map;
        }, new Map<string, number>());
    }

    /**
     * Count the number of words in the texts in the analyzer
     * @param words The words to check
     * @returns A Map of words and their counts
     */
    public count(words: Set<string> | string[]): Map<string, number> {
        return this.texts.reduce((map, text) => {
            const analyzer = new Analyzer(text, this._case);
            analyzer.ignore(this._ignore);
            analyzer.split(this._split);
            analyzer.count(words).forEach((count, word) => {
                map.set(word, (map.get(word) || 0) + count);
            });
            return map;
        }, new Map<string, number>());
    }

    /**
     * Get meaningful words of the texts in the analyzer
     * @param min_length The minimum length of a meaningful word
     * @param min_count The minimum count of a meaningful word
     * @returns A Map of words and their counts
     */
    public meaningful(min_length = 2, min_count = 2): Map<string, number> {
        return this.texts.reduce((map, text) => {
            const analyzer = new Analyzer(text, this._case);
            analyzer.ignore(this._ignore);
            analyzer.split(this._split);
            analyzer.meaningful(min_length, min_count).forEach((count, word) => {
                map.set(word, (map.get(word) || 0) + count);
            });
            return map;
        }, new Map<string, number>());
    }

    /**
     * Get document frequency of the words in the analyzer
     * @param words The words to check
     * @returns A Map of words and their inverse document frequency
     */
    public df(words: Set<string> | string[]): Map<string, number> {
        words = [...new Set(words)];

        const df = new Map<string, number>();

        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < words.length; j++) {
                df.set(words[j], (df.get(words[j]) || 0) + (this.texts[i].includes(words[j]) ? 1 : 0));
            }
        }

        return df;
    }

    /**
     * Get inverse document frequency of the words in the analyzer
     * @param words The words to check
     * @returns A Map of words and their inverse document frequency
     */
    public idf(words: Set<string> | string[]): Map<string, number> {
        const df = this.df(words);
        const total = this.length;
        return new Map([...df].map(([word, count]) => [word, Math.log10(total / count)]));
    }

    /**
     * Get TF-IDF of the words in the analyzer
     * @param words The words to check
     * @returns A Map of words and their TF-IDF value
     */
    public tfidf(words: Set<string> | string[]): Map<string, number> {
        const tf = this.count(words);
        const idf = this.idf(words);
        return new Map([...tf].map(([word, count]) => [word, count * <number>idf.get(word)]));
    }

    /**
     * Get co-occurrence matrix of the texts in the analyzer.
     * @param words The words to check
     * @returns A Map of words and their co-occurrence matrix
     */
    public coword(words: Set<string> | string[]): Map<string, Set<number>> {
        words = [...new Set(words)];

        const cowords = new Map<string, Set<number>>();

        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                const index = this.texts[i].indexOf(word);
                if (index >= 0) {
                    const set = cowords.get(word) || new Set<number>();
                    set.add(index);
                    cowords.set(word, set);
                }
            }
        }

        return cowords;
    }

    /**
     * Get the number of the texts in the analyzer
     */
    public get length(): number {
        return this.texts.length;
    }

    /**
     * Get the size of all texts in the analyzer
     */
    public get size(): number {
        return this.texts.reduce((size, text) => size + text.length, 0);
    }
}

export default GroupAnalyzer;
