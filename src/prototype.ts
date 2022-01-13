import { spaces } from "./dictionary";

export class AnalyzerPrototype {
    public _case = false;
    public _ignore = new Set<string>();
    public _split = spaces;

    constructor(case_sensitive = false) {
        if (case_sensitive) {
            this.case_sensitive();
        } else {
            this.case_insensitive();
        }
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

export default AnalyzerPrototype;
