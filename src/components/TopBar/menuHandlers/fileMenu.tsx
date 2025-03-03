import { UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { debugLog } from "../../../logger";
import { closeAlert, openAlert } from "../../Alerts/alertsSlice";
import React from "react";
import { Alert } from "../../Alerts/Alert/Alert";

export function saveAs(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Save As...");

    const key = "saveAs";

    dispatch(openAlert({
        key: key, 
        value: React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

             TASM`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { dispatch(closeAlert(key)) },
        buttonCallback: () => { dispatch(closeAlert(key)) },
        key: key
    })}));
}