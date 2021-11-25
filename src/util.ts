import { getCrossoverMons } from "./data";

export function minBy<T>(arr: T[], mapper: (obj: T) => number): T {
    return arr.reduce((acc, curr) => {
        return mapper(acc) <= mapper(curr) ? acc : curr;
    }, arr[0]);
}

export function pathToString(path: string[]): string {
    return path.join(" -> ");
}

export function pathDetailsToString(path: string[]): string {
    const header = pathToString(path);
    const steps: string[] = [];

    for (let i = 0; i < path.length - 1; i++) {
        const [from, to] = path.slice(i, i + 2);
        steps.push(
            `${pathToString([from, to])}\n${getCrossoverMons(from, to)}`
        );
    }

    return `${header}\n\n${steps.join("\n\n")}`;
}
