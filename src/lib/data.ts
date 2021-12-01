import memoizeOne from "memoize-one";
import mons from "pokemon-assets/assets/data/pokemon.json";

/**
 * Gets all mons available up to Gen 4
 */
export const getAvailableMons = memoizeOne(() => {
    const lastNationalDex = 487;
    return Object.values(mons)
        .filter(x => x.num <= lastNationalDex)
        .filter(x => x.forme === null);
});

/**
 * Gets a record of EggGroupPair -> Pokemon[]
 * where EggGroupPair is defined as the result of calling @see eggGroupsToString
 * with the two egg groups the Pokemon is part of
 * Will not include Pokemon that are part of only one egg group
 */
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

/**
 * Gets all valid available egg groups up to Gen 4 (or as specified in @see getAvailableMons)
 */
export const getValidEggGroups = memoizeOne(() => {
    return Array.from(new Set(getAvailableMons().flatMap(x => x.eggGroups)));
});

/**
 * Joins Egg Groups in alphabetical order
 */
export function eggGroupsToString(groups: string[]): string {
    return groups.sort().join("");
}

/**
 * Gets a list of Pokemon that can act as a bridge between two Egg Groups
 */
export function getCrossoverMons(from: string, to: string): string[] {
    const crossoverId = eggGroupsToString([from, to]);
    return getCrossoverGroups()[crossoverId];
}
