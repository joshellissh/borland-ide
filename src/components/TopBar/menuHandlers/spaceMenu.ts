import React, { Dispatch } from "react";
import { debugLog } from "../../../logger";
import { Alert } from "../../Alerts/Alert/Alert";
import { closeAlert, openAlert } from "../../Alerts/alertsSlice";
import { UnknownAction } from "@reduxjs/toolkit";

export function tasmOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Assembler...");

    const key = "tasm";

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


export function tdOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Debugger...");

    const key = "td";

    dispatch(openAlert({
        key: key, 
        value: React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

              td`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { dispatch(closeAlert(key)) },
        buttonCallback: () => { dispatch(closeAlert(key)) },
        key: key
    })}));
}


export function tpOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Profiler...");

    const key = "tp";

    dispatch(openAlert({
        key: key, 
        value: React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

             tprof`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { dispatch(closeAlert(key)) },
        buttonCallback: () => { dispatch(closeAlert(key)) },
        key: key
    })}));
}