import { toRecord } from "./record";
import { minBy } from "./util";

export const enum DjikstraStatus {
    FAILURE = "failure",
    SUCCESS = "success"
}

export interface DjikstraSuccess<T> {
    message?: string;
    paths: T[][];
    status: DjikstraStatus.SUCCESS;
}

export interface DjikstraFailure {
    message: string;
    status: DjikstraStatus.FAILURE;
}

export type DjikstraResult<T> = DjikstraSuccess<T> | DjikstraFailure;

export function isDjikstraSuccess<T>(
    result: DjikstraResult<T>
): result is DjikstraSuccess<T> {
    return result.status === DjikstraStatus.SUCCESS;
}

export function isDjikstraFailure(
    result: DjikstraResult<unknown>
): result is DjikstraFailure {
    return result.status === DjikstraStatus.FAILURE;
}

export function djikstra<T>(
    from: T,
    to: T,
    items: T[],
    keyExtractor: (item: T) => string,
    doesEdgeExist: (from: T, to: T) => boolean
): DjikstraResult<T> {
    const fromKey = keyExtractor(from);
    const toKey = keyExtractor(to);

    if (fromKey === toKey) {
        return {
            message: "Start and end are the same node",
            paths: [[]],
            status: DjikstraStatus.SUCCESS
        };
    }

    // Structure init
    const lookup = toRecord(items, keyExtractor);
    const allKeys = items.map(keyExtractor);
    const notYetVisited = new Set([...allKeys]);
    const dist = createKeyRecord(allKeys, Infinity);
    const prevs = createKeyRecord<string[] | undefined>(allKeys, undefined);
    dist[fromKey] = 0;

    // Utility functions
    function getNeighbors(node: T): T[] {
        return items.filter(x => doesEdgeExist(node, x));
    }

    // Execute djikstras
    while (notYetVisited.size > 0) {
        const currentKey = minBy(
            Array.from(notYetVisited.values()),
            x => dist[x]
        );
        const current = lookup[currentKey];
        notYetVisited.delete(currentKey);

        if (currentKey === toKey) {
            break;
        }

        getNeighbors(current)
            .filter(x => notYetVisited.has(keyExtractor(x)))
            .forEach(neighbor => {
                const neighborKey = keyExtractor(neighbor);
                const alt = dist[currentKey] + 1;

                if (alt < dist[neighborKey]) {
                    dist[neighborKey] = alt;
                    prevs[neighborKey] = [currentKey];
                } else if (alt === dist[neighborKey]) {
                    if (!prevs[neighborKey]) {
                        prevs[neighborKey] = [];
                    }
                    prevs[neighborKey]!.push(currentKey);
                }
            });
    }

    if (!prevs[toKey]) {
        return {
            message: `No path was found from ${fromKey} to ${toKey}`,
            status: DjikstraStatus.FAILURE
        };
    } else {
        const paths = walkback(prevs, toKey, lookup);
        return { paths, status: DjikstraStatus.SUCCESS };
    }
}

function walkback<T>(
    prevs: Record<string, string[] | undefined>,
    current: string,
    lookup: Record<string, T>
): T[][] {
    const currentPrevs = prevs[current];
    if (currentPrevs === undefined) {
        return [[lookup[current]]];
    }

    return currentPrevs
        .map(x => walkback(prevs, x, lookup))
        .flatMap(x => x.map(y => [...y, lookup[current]]));
}

function createKeyRecord<T>(keys: string[], val: T): Record<string, T> {
    return Array.from(keys).reduce((acc, curr) => {
        acc[curr] = val;
        return acc;
    }, {} as Record<string, T>);
}
