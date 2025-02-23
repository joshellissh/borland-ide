import React, { Dispatch } from "react";
import { debugLog } from "../../../logger";
import { Alert } from "../../Alerts/Alert/Alert";
import { closeAlert, openAlert } from "../../Alerts/alertsSlice";
import { UnknownAction } from "@reduxjs/toolkit";

export function aboutOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening About...");

    const key = "about";

    dispatch(openAlert({
        key: key,
        value: React.createElement(Alert, {
            title: "About",
            message: `
            Turbo C++
           Version 3.0
    Copyright (c) 1990, 1992 by
    Borland International, Inc.

      Web port by Josh Ellis
  https://github.com/joshellissh`,
            dimensions: { width: 36, height: 13 },
            buttonText: "OK",
            buttonHotkey: 1,
            closeCallback: () => { dispatch(closeAlert(key)) },
            buttonCallback: () => { dispatch(closeAlert(key)) },
            key: key
        })
    }));
}