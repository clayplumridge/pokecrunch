export function cartesian<T>(first: T[], second: T[]): [T, T][] {
    return first.flatMap(x => {
        return second.map<[T, T]>(y => [x, y]);
    });
}
