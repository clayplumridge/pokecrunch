import { getAvailableMons } from "./data";
import { djikstra, isDjikstraSuccess } from "./graph";
import { cartesian } from "./math";
import { pathDetailsToString } from "./util";

const startMonName = "graveler";
const endMonName = "magikarp";

const startMon = getAvailableMons().find(
    x => x.name.toLowerCase() === startMonName.toLowerCase()
);
const endMon = getAvailableMons().find(
    x => x.name.toLowerCase() == endMonName.toLowerCase()
);

if (!startMon) {
    console.log(`Unable to find pokemon data for ${startMonName}`);
    process.exit();
} else if (!endMon) {
    console.log(`Unable to find pokemon data for ${endMonName}`);
    process.exit();
}

const validStartGroups = startMon.eggGroups;
const validEndGroups = endMon.eggGroups;

const djikstraPaths = cartesian(validStartGroups, validEndGroups)
    .map(([start, end]) => djikstra(start, end))
    .filter(isDjikstraSuccess)
    .flatMap(result => result.paths);

const shortestPathLength = Math.min(...djikstraPaths.map(x => x.length));
const shortestPaths = djikstraPaths.filter(
    x => x.length === shortestPathLength
);

const divider = "\n----------------------------------------\n";
const output = shortestPaths.map(pathDetailsToString).join(divider);
console.log(output);
