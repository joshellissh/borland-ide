import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import documentsReducer from "./components/Documents/documentsSlice"
import cursorReducer from "./components/Cursor/cursorSlice"
import appReducer from "./appSlice"
import topBarReducer from "./components/TopBar/topBarSlice"
import windowReducer from "./components/Windows/windowsSlice"
import {enableMapSet} from "immer";

const defaultMiddlewareConfig = {
    serializableCheck: false
};

enableMapSet();

export const store = configureStore({
    reducer: {
        app: appReducer,
        cursor: cursorReducer,
        documents: documentsReducer,
        topBar: topBarReducer,
        windows: windowReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(defaultMiddlewareConfig),
});

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>