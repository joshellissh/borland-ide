import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {XY} from "../../types.ts";
import {RootState} from "../../store.ts";

export interface CursorState {
    position: XY;
}

const initialState: CursorState = {
    position: {x: 0, y: 0}
};

export const cursorSlice = createSlice({
    name: "cursor",
    initialState,
    reducers: {
        setPosition: (state, action: PayloadAction<XY>) => {
            state.position = action.payload;
        },
    }
});

export const selectPosition = (state: RootState) => state.cursor.position;

export const { setPosition } = cursorSlice.actions;
export default cursorSlice.reducer;