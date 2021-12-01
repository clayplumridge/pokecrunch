/**
 * Converts a pair of arrays to tuples containing the elements of the cartesian product
 * In other words, generates all pairs of elements where the first item is from the first array
 * and the second item is from the second array
 * Eg. [1], [2,3] -> [[1,2],[1,3]]
 */
export function cartesian<T1, T2>(first: T1[], second: T2[]): [T1, T2][] {
    return first.flatMap(x => {
        return second.map<[T1, T2]>(y => [x, y]);
    });
}
