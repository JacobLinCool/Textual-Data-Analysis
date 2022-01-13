export function escape_regex(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function sort_map<T>(map: Map<T, number>): Map<T, number> {
    const sorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    return sorted;
}
