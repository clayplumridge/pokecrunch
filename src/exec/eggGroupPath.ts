import {
    eggGroupsToString,
    getAvailableMons,
    getCrossoverGroups,
    getValidEggGroups
} from "../lib/data";
import { djikstra, isDjikstraSuccess } from "../lib/graph";
import { cartesian } from "../lib/math";
import { pathDetailsToString } from "../lib/util";

/**
 * Attempt to find a path between two pokemon using egg groups
 * to allow transfer of egg moves from one pokemon to another
 */
export function exec(startMonName: string, endMonName: string): string {
    // Setup
    const startMon = getAvailableMons().find(
        x => x.name.toLowerCase() === startMonName.toLowerCase()
    );
    const endMon = getAvailableMons().find(
        x => x.name.toLowerCase() == endMonName.toLowerCase()
    );

    // Validation
    if (!startMon) {
        return `Unable to find pokemon data for ${startMonName}`;
    } else if (!endMon) {
        return `Unable to find pokemon data for ${endMonName}`;
    }

    // Setup part 2
    const validStartGroups = startMon.eggGroups;
    const validEndGroups = endMon.eggGroups;

    // Utility functions
    function hasEdge(from: string, to: string): boolean {
        return (
            Object.keys(getCrossoverGroups()).filter(
                x => x === eggGroupsToString([from, to])
            ).length > 0
        );
    }

    // Run djikstras; max of 4 times
    const djikstraPaths = cartesian(validStartGroups, validEndGroups)
        .map(([start, end]) =>
            djikstra(start, end, getValidEggGroups(), x => x, hasEdge)
        )
        .filter(isDjikstraSuccess)
        .flatMap(result => result.paths);

    // Filter down to whatever the shortest paths were, since we're running
    // djikstra multiple times above
    const shortestPathLength = Math.min(...djikstraPaths.map(x => x.length));
    const shortestPaths = djikstraPaths.filter(
        x => x.length === shortestPathLength
    );

    // Format output
    const divider = "\n----------------------------------------\n";
    return shortestPaths.map(pathDetailsToString).join(divider);
}
