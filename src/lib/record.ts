/**
 * Converts a list of T -> Record<K, T>
 * Where K is some derivable key of T, represented by @param keyExtractor
 */
export function toRecord<T, Key extends string | number | symbol>(
    items: T[],
    keyExtractor: (item: T) => Key
): Record<Key, T> {
    return items.reduce<Record<Key, T>>((acc, curr) => {
        acc[keyExtractor(curr)] = curr;
        return acc;
    }, {} as Record<Key, T>);
}
