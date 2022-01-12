import { spaces } from "./dictionary";

export class Analyzer {
    public text = "";
    public _case = false;
    public _ignore = new Set<string>();
    public _split = spaces;

    constructor(text = "", case_sensitive = false) {
        this.set(text);

        if (case_sensitive) {
            this.case_sensitive();
        } else {
            this.case_insensitive();
        }
    }

    /**
     * Set the text in the analyzer
     * @param text The text to set
     */
    public set(text: string): this {
        this.text = text;
        return this;
    }

    /**
     * Set the ignore set
     * @param ignore The ignore set or array
     * @returns The analyzer
     */
    public ignore(ignore: Set<string> | string[]): this {
        ignore.forEach((word) => this._ignore.add(word));
        return this;
    }

    /**
     * Get the ignore set
     * @returns The ignore set
     */
    public get_ignore(): Set<string> {
        return this._ignore;
    }

    /**
     * Clear the ignore set
     * @returns The analyzer
     */
    public clear_ignore(): this {
        this._ignore.clear();
        return this;
    }

    /**
     * Set the split set
     * @param split The split set or array
     * @returns The analyzer
     */
    public split(split: Set<string> | string[]): this {
        split.forEach((word) => this._split.add(word));
        return this;
    }

    /**
     * Get the split set
     * @returns The split set
     */
    public get_split(): Set<string> {
        return this._split;
    }

    /**
     * Clear the split set
     * @returns The analyzer
     */
    public clear_split(): this {
        this._split.clear();
        return this;
    }

    /**
     * Get ignored and splitted segments of the text in the analyzer
     * @returns The segments that has been ignored and splitted
     */
    public segments(): string[] {
        let segments = [
            (this._case ? this.text : this.text.toLowerCase()).replace(
                new RegExp(`${[...this._ignore].map((x) => "\\" + (this._case ? x : x.toLowerCase())).join("|")}`, "g"),
                "",
            ),
        ];
        if (this._split.size) {
            segments = segments[0].split(
                new RegExp(`${[...this._split].map((x) => "\\" + (this._case ? x : x.toLowerCase())).join("|")}`, "g"),
            );
        }
        return segments;
    }

    /**
     * N-grams of the text in the analyzer
     * @param n The n-gram size
     * @returns A Map of slices and their counts
     */
    public ngram(n: number): Map<string, number> {
        const segments = this.segments();

        const ngrams = new Map<string, number>();

        for (let i = 0; i < segments.length; i++) {
            for (let j = 0; j < segments[i].length - n + 1; j++) {
                const ngram = segments[i].substring(j, j + n);
                ngrams.set(ngram, ngrams.has(ngram) ? <number>ngrams.get(ngram) + 1 : 1);
            }
        }

        return ngrams;
    }

    /**
     * Count the number of words in the text in the analyzer
     * @param words The words to check
     * @returns A Map of words and their counts
     */
    public count(words: Set<string> | string[]): Map<string, number> {
        words = [...words].sort((a, b) => b.length - a.length);
        const segments = this.segments();

        const counts = new Map<string, number>();

        for (let i = 0; i < segments.length; i++) {
            for (let j = 0; j < segments[i].length; j++) {
                for (let k = 0; k < words.length; k++) {
                    const test = segments[i].substring(j, j + words[k].length);
                    if (test === words[k]) {
                        counts.set(test, counts.has(test) ? <number>counts.get(test) + 1 : 1);
                        j += words[k].length - 1;
                        break;
                    }
                }
            }
        }

        return counts;
    }

    /**
     * Get meaningful words of the text in the analyzer
     * @param min_length The minimum length of a meaningful word
     * @param min_count The minimum count of a meaningful word
     * @returns A Map of words and their counts
     */
    public meaningful(min_length = 2, min_count = 2): Map<string, number> {
        if (min_length < 1 || min_count < 1) {
            throw new Error("min_length and min_count must be greater than 0");
        }

        const meaningful = new Map<string, number>();

        const initial_splits = [...new Set(this._split)];

        for (let len = Math.floor(this.length / min_count); len >= min_length; len--) {
            const words = this.ngram(len);

            for (const [word, count] of words) {
                if (count >= min_count) {
                    meaningful.set(word, count);
                }
            }

            this.clear_split();
            this.split([...initial_splits, ...meaningful.keys()]);
        }

        this.clear_split();
        this.split(initial_splits);

        return meaningful;
    }

    /**
     * Get the length of the text in the analyzer
     */
    public get length(): number {
        return this.text.length;
    }

    /**
     * Make analysis case-insensitive
     */
    public case_insensitive(): this {
        this._case = false;
        return this;
    }

    /**
     * Make analysis case-sensitive
     */
    public case_sensitive(): this {
        this._case = true;
        return this;
    }
}

export default Analyzer;
