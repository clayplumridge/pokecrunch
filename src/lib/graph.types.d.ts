/**
 * Used to discriminate DjikstraSuccess from DjikstraFailure
 */
export const enum DjikstraStatus {
    FAILURE = "failure",
    SUCCESS = "success"
}

/**
 * A successful pass Djikstra result; it means that at least one path was found between the nodes
 * The paths returned will be all paths of the same length as the shortest path found
 */
export interface DjikstraSuccess<T> {
    message?: string;
    paths: T[][];
    status: DjikstraStatus.SUCCESS;
}

/**
 * A failure of Djikstra; usually, this means that no path was found from the start node to the end node
 */
export interface DjikstraFailure {
    exception?: any;
    message: string;
    status: DjikstraStatus.FAILURE;
}

/**
 * Union of all types that Djikstra can return
 */
export type DjikstraResult<T> = DjikstraSuccess<T> | DjikstraFailure;
