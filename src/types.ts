export type Dimensions = {
    width: number;
    height: number;
}

export type XY = {
    x: number;
    y: number;
}

export interface DocumentInfo {
    id: number;
    name?: string;
    position?: XY;
    size?: Dimensions;
    maximized?: boolean;
    nonMaxSize?: Dimensions;
    nonMaxPosition?: XY;
    moving?: boolean;
    moveOffset?: XY;
}