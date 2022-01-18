export function escape_regex(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function sort_map<T, K>(map: Map<T, K>): Map<T, K> {
    const sorted = new Map(
        [...map.entries()].sort((a, b) => {
            if (b[1] instanceof Set && a[1] instanceof Set) {
                return b[1].size - a[1].size;
            } else if (typeof a[1] === "number" && typeof b[1] === "number") {
                return b[1] - a[1];
            } else {
                return b[1] < a[1] ? 1 : -1;
            }
        }),
    );
    return sorted;
}
