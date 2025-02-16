import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {XY} from "../../types.ts";
import {RootState} from "../../store.ts";

export interface CursorState {
    livePosition: XY;
}

const initialState: CursorState = {
    livePosition: {x: 0, y: 0}
};

export const cursorSlice = createSlice({
    name: "cursor",
    initialState,
    reducers: {
        setLivePosition: (state, action: PayloadAction<XY>) => {
            state.livePosition = action.payload;
        },
    }
});

export const selectLivePosition = (state: RootState) => state.cursor.livePosition;

export const { setLivePosition } = cursorSlice.actions;
export default cursorSlice.reducer;