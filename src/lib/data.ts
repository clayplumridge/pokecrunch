import memoizeOne from "memoize-one";
import mons from "pokemon-assets/assets/data/pokemon.json";

export const getAvailableMons = memoizeOne(() => {
    const lastNationalDex = 487;
    return Object.values(mons)
        .filter(x => x.num <= lastNationalDex)
        .filter(x => x.forme === null);
});

export const getCrossoverGroups = memoizeOne(() => {
    // Find mons that have more than 1 egg group
    const crossoverMons = getAvailableMons().filter(
        x => x.eggGroups.length > 1
    );

    // Reverse the mapping and get a list of mons per group crossover
    return crossoverMons.reduce((acc, curr) => {
        const groupsAsString = eggGroupsToString(curr.eggGroups);
        if (acc[groupsAsString] === undefined) {
            acc[groupsAsString] = [];
        }
        acc[groupsAsString].push(curr.name);
        return acc;
    }, {} as Record<string, string[]>);
});

export const getValidEggGroups = memoizeOne(() => {
    return Array.from(new Set(getAvailableMons().flatMap(x => x.eggGroups)));
});

export function eggGroupsToString(groups: string[]): string {
    return groups.sort().reduce((acc, curr) => acc + curr, "");
}

export function getCrossoverMons(from: string, to: string): string[] {
    const crossoverId = eggGroupsToString([from, to]);
    return getCrossoverGroups()[crossoverId];
}
