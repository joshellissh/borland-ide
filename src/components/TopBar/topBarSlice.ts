import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "../../store.ts";

export interface TopBarState {
    activeMenu: number;
}

const initialState: TopBarState = {
    activeMenu: -1
};

export const topBarSlice = createSlice({
    name: "topBar",
    initialState,
    reducers: {
        setActiveMenu: (state, action: PayloadAction<number>) => {
            state.activeMenu = action.payload;
        },
        activateLeftMenu: (state) => {
            state.activeMenu -= 1;

            if (state.activeMenu < -1) {
                state.activeMenu = 10;
            }
        },
        activateRightMenu: (state) => {
            state.activeMenu += 1;

            if (state.activeMenu > 10) {
                state.activeMenu = 0;
            }
        },
    }
});

export const selectActiveMenu = (state: RootState) => state.topBar.activeMenu;

export const { setActiveMenu, activateLeftMenu, activateRightMenu } = topBarSlice.actions;
export default topBarSlice.reducer;