import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ReactElement } from "react";

export interface AlertsState {
    map: Map<string, ReactElement>;
}


const initialState: AlertsState = {
    map: new Map<string, ReactElement>()
};


export const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        openAlert: (state, payload: PayloadAction<{key: string, value: ReactElement}>) => {
            state.map.set(payload.payload.key, payload.payload.value);
        },
        closeAlert: (state, payload: PayloadAction<string>) => {
            state.map.delete(payload.payload);
        },
    }
});


export const selectAlerts = (state: RootState) => state.alerts.map;


export const { openAlert, closeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;