import {
    eggGroupsToString,
    getCrossoverGroups,
    getValidEggGroups
} from "./data";
import { minBy } from "./util";

export const enum DjikstraStatus {
    FAILURE = "failure",
    SUCCESS = "success"
}

export interface DjikstraSuccess {
    message?: string;
    paths: string[][];
    status: DjikstraStatus.SUCCESS;
}

export interface DjikstraFailure {
    message: string;
    status: DjikstraStatus.FAILURE;
}

export type DjikstraResult = DjikstraSuccess | DjikstraFailure;

export function isDjikstraSuccess(
    result: DjikstraResult
): result is DjikstraSuccess {
    return result.status === DjikstraStatus.SUCCESS;
}

export function djikstra(from: string, to: string): DjikstraResult {
    if (from === to) {
        return {
            message: "These mons share an egg group",
            paths: [[]],
            status: DjikstraStatus.SUCCESS
        };
    }

    const notYetVisited = new Set([...getValidEggGroups()]);
    const dist = createEggGroupRecord(Infinity);
    const prevs = createEggGroupRecord<string[] | undefined>(undefined);

    dist[from] = 0;

    while (notYetVisited.size > 0) {
        const current = minBy(Array.from(notYetVisited.values()), x => dist[x]);
        notYetVisited.delete(current);

        if (current === to) {
            break;
        }

        getNeighbors(current)
            .filter(x => notYetVisited.has(x))
            .forEach(neighbor => {
                const alt = dist[current] + 1;

                if (alt < dist[neighbor]) {
                    dist[neighbor] = alt;
                    prevs[neighbor] = [current];
                } else if (alt === dist[neighbor]) {
                    if (!prevs[neighbor]) {
                        prevs[neighbor] = [];
                    }
                    prevs[neighbor]!.push(current);
                }
            });
    }

    if (!prevs[to]) {
        return {
            message: `No path was found from egg group ${from} to ${to}`,
            status: DjikstraStatus.FAILURE
        };
    } else {
        const paths = walkback(prevs, to);
        return { paths, status: DjikstraStatus.SUCCESS };
    }
}

function walkback(
    prevs: Record<string, string[] | undefined>,
    current: string
): string[][] {
    const currentPrevs = prevs[current];
    if (currentPrevs === undefined) {
        return [[current]];
    }

    return currentPrevs
        .map(x => walkback(prevs, x))
        .flatMap(x => x.map(y => [...y, current]));
}

export function hasEdge(from: string, to: string): boolean {
    return (
        Object.keys(getCrossoverGroups()).filter(
            x => x === eggGroupsToString([from, to])
        ).length > 0
    );
}

function createEggGroupRecord<T>(val: T): Record<string, T> {
    return Array.from(getValidEggGroups().values()).reduce((acc, curr) => {
        acc[curr] = val;
        return acc;
    }, {} as Record<string, T>);
}

function getNeighbors(group: string): string[] {
    return getValidEggGroups().filter(x => hasEdge(group, x));
}
