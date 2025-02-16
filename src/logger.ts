import {store} from "./store.ts";

export function debugLog(text: string) {
    if (store.getState().app.debug) {
        console.log(text);
    }
}