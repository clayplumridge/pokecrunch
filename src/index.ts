import { getAvailableMons } from "./data";
import { djikstra, isDjikstraSuccess } from "./graph";
import { cartesian } from "./math";
import { pathDetailsToString } from "./util";

const [startMonName, endMonName] = process.argv.slice(2);

if (!startMonName) {
    console.log("Start pokemon name missing - run with some args!");
    process.exit(1);
}

if (!endMonName) {
    console.log("End pokemon name missing - run with some args!");
    process.exit(1);
}

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
