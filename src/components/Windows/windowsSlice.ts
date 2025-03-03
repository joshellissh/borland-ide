import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ReactElement } from "react";
import { debugLog } from "../../logger";

export interface WindowsState {
    map: Map<string, ReactElement>;
}


const initialState: WindowsState = {
    map: new Map<string, ReactElement>()
};


export const windowsSlice = createSlice({
    name: "windows",
    initialState,
    reducers: {
        windowOpen: (state, payload: PayloadAction<{key: string, value: ReactElement}>) => {
            console.log("Opening window '" + payload.payload.key + "'");

            state.map.set(payload.payload.key, payload.payload.value);
        },
        windowClose: (state, payload: PayloadAction<string>) => {
            console.log("Closing window '" + payload.payload + "'");


            state.map.delete(payload.payload);
        },
    }
});


export const selectWindows = (state: RootState) => state.windows.map;


export const { windowOpen, windowClose } = windowsSlice.actions;
export default windowsSlice.reducer;