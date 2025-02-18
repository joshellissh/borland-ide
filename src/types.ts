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
    name: string;
    docPos: XY;
    docSize: Dimensions;
    maximized?: boolean;
    nonMaxDimensions?: Dimensions;
    nonMaxPos?: XY;
}