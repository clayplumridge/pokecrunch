import {
    eggGroupsToString,
    getAvailableMons,
    getCrossoverGroups,
    getValidEggGroups
} from "../lib/data";
import { djikstra, isDjikstraSuccess } from "../lib/graph";
import { cartesian } from "../lib/math";
import { pathDetailsToString } from "../lib/util";

export function exec(startMonName: string, endMonName: string): string {
    const startMon = getAvailableMons().find(
        x => x.name.toLowerCase() === startMonName.toLowerCase()
    );

    const endMon = getAvailableMons().find(
        x => x.name.toLowerCase() == endMonName.toLowerCase()
    );

    if (!startMon) {
        console.log(`Unable to find pokemon data for ${startMonName}`);
        process.exit(1);
    } else if (!endMon) {
        console.log(`Unable to find pokemon data for ${endMonName}`);
        process.exit(1);
    }

    const validStartGroups = startMon.eggGroups;
    const validEndGroups = endMon.eggGroups;

    function hasEdge(from: string, to: string): boolean {
        return (
            Object.keys(getCrossoverGroups()).filter(
                x => x === eggGroupsToString([from, to])
            ).length > 0
        );
    }

    const djikstraPaths = cartesian(validStartGroups, validEndGroups)
        .map(([start, end]) =>
            djikstra(start, end, getValidEggGroups(), x => x, hasEdge)
        )
        .filter(isDjikstraSuccess)
        .flatMap(result => result.paths);

    const shortestPathLength = Math.min(...djikstraPaths.map(x => x.length));
    const shortestPaths = djikstraPaths.filter(
        x => x.length === shortestPathLength
    );

    const divider = "\n----------------------------------------\n";
    const output = shortestPaths.map(pathDetailsToString).join(divider);
    return output;
}
