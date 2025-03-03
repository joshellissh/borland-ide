import { Dispatch } from "react";
import { debugLog } from "../../../logger.ts";
import { UnknownAction } from "@reduxjs/toolkit";
import { closeWindow, openWindow } from "../../Windows/Windows.tsx";
import { Button } from '../../Button/Button.tsx';
import { Text } from '../../Text/Text.tsx';


export function aboutOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening About...");

    const name = "about";

    const message = `
            Turbo C++
           Version 3.0
    Copyright (c) 1990, 1992 by
    Borland International, Inc.

      Web port by Josh Ellis`;

    openWindow(dispatch, {
        center: true,
        dimensions: { width: 36, height: 13 },
        focusElement: "aboutOk",
        modal: true,
        name: name,
        title: "About",
        contents: (<>
            <Text bX={0} bY={0} position="relative">{message}</Text>
            <a href="https://github.com/joshellissh" target="_blank"><Text bX={2} bY={0} position="relative">https://github.com/joshellissh</Text></a>
            <Button callback={() => closeWindow(dispatch, name)} text="OK" hotkeyIndex={1} center={true} id="aboutOk" />
        </>
    )});
}