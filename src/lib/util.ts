import { getCrossoverMons } from "./data";

/**
 * Gets the smallest T from the list where there's some way to map T -> number
 */
export function minBy<T>(arr: T[], mapper: (obj: T) => number): T {
    return arr.reduce((acc, curr) => {
        return mapper(acc) <= mapper(curr) ? acc : curr;
    }, arr[0]);
}

/**
 * Converts a path of nodes to a string representation
 * Suitable for display in userspace
 * TODO(clayplumridge): Move this to another file
 */
export function pathToString(path: string[]): string {
    return path.join(" -> ");
}

/**
 * Converts an egg-group path to a detailed string including the path itself
 * and all substeps
 * Suitable for diplay in userspace
 * TODO(clayplumridge): Move this to another file
 */
export function pathDetailsToString(path: string[]): string {
    const header = pathToString(path);
    const steps: string[] = [];

    for (let i = 0; i < path.length - 1; i++) {
        const [from, to] = path.slice(i, i + 2);
        steps.push(
            `${pathToString([from, to])}\n${getCrossoverMons(from, to).join(
                ", "
            )}`
        );
    }

    return `${header}\n\n${steps.join("\n\n")}`;
}
