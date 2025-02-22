import React from "react";
import { debugLog } from "../../../logger";
import { Alert } from "../../Alert/Alert";

export function tasmOpen(add: Function, remove: Function) {
    debugLog("Opening Turbo Assembler...");

    add("tasm", React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

             TASM`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { remove("tasm") },
        buttonCallback: () => { remove("tasm") },
        key: "tasm"
    }));
}


export function tdOpen(add: Function, remove: Function) {
    debugLog("Opening Turbo Debugger...");

    add("td", React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

              td`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { remove("td") },
        buttonCallback: () => { remove("td") },
        key: "td"
    }));
}


export function tpOpen(add: Function, remove: Function) {
    debugLog("Opening Turbo Profiler...");

    add("tp", React.createElement(Alert, {
        title: "Error",
        message: `
    Cannot find executable: 

             tprof`,
        dimensions: { width: 32, height: 11 },
        buttonText: "OK",
        buttonHotkey: 1,
        closeCallback: () => { remove("tp") },
        buttonCallback: () => { remove("tp") },
        key: "tp"
    }));
}