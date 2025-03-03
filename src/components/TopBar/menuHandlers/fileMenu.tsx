import { UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { debugLog } from "../../../logger";

// @ts-ignore
export function saveAs(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Save As...");
}