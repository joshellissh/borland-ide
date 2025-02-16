import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Dimensions} from "./types.ts";
import {RootState} from "./store.ts";

export interface AppState {
    blockSize: Dimensions; // Width and height of "block" in pixels
    cols: number; // Width of app in blocks
    debug: boolean; // Run in debug mode
    dimensions: Dimensions; // Width and height of app screen in pixels
    leftOffset: number; // App offset from left edge of document in pixels
    rows: number; // Height of app in blocks
}

const initialState: AppState = {
    blockSize: { width: 0, height: 0 },
    cols: 80,
    debug: true,
    dimensions: { width: 0, height: 0 },
    leftOffset: 0,
    rows: 25,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLeftOffset: (state, action: PayloadAction<number>) => {
            state.leftOffset = action.payload;
        },
        setDimensions: (state, action: PayloadAction<Dimensions>) => {
            state.dimensions = action.payload;
        },
        setBlockSize: (state, action: PayloadAction<Dimensions>) => {
            state.blockSize = action.payload;
        },
    }
});

export const selectBlockSize = (state: RootState) => state.app.blockSize;
export const selectCols = (state: RootState) => state.app.cols;
export const selectDebug = (state: RootState) => state.app.debug;
export const selectDimensions = (state: RootState) => state.app.dimensions;
export const selectLeftOffset = (state: RootState) => state.app.leftOffset;
export const selectRows = (state: RootState) => state.app.rows;

export const { setLeftOffset, setDimensions, setBlockSize } = appSlice.actions;
export default appSlice.reducer;