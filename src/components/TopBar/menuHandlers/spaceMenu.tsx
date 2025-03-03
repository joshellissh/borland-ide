import { Dispatch } from "react";
import { debugLog } from "../../../logger";
import { UnknownAction } from "@reduxjs/toolkit";
import { closeWindow, openWindow } from "../../Windows/Windows";
import { Text } from "../../Text/Text";
import { Button } from "../../Button/Button";

export function tasmOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Assembler...");

    const name = "tasm";
    const message = `
    Cannot find executable: 

             TASM`;
    
    openWindow(dispatch, {
        center: true,
        dimensions: { width: 32, height: 11 },
        name: name,
        title: "Error",
        contents: (<>
            <Text bX={0} bY={0} position="relative">{message}</Text>
            <Button center={true} callback={() => closeWindow(dispatch, name)} text="OK" hotkeyIndex={1} />
        </>
    )});
}


export function tdOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Debugger...");

    const name = "td";
    const message = `
    Cannot find executable: 

             td`;
    
    openWindow(dispatch, {
        center: true,
        dimensions: { width: 32, height: 11 },
        name: name,
        title: "Error",
        contents: (<>
            <Text bX={0} bY={0} position="relative">{message}</Text>
            <Button center={true} callback={() => closeWindow(dispatch, name)} text="OK" hotkeyIndex={1} />
        </>
    )});
}


export function tpOpen(dispatch: Dispatch<UnknownAction>) {
    debugLog("Opening Turbo Profiler...");

    const name = "tp";
    const message = `
    Cannot find executable: 

             tp`;
    
    openWindow(dispatch, {
        center: true,
        dimensions: { width: 32, height: 11 },
        name: name,
        title: "Error",
        contents: (<>
            <Text bX={0} bY={0} position="relative">{message}</Text>
            <Button center={true} callback={() => closeWindow(dispatch, name)} text="OK" hotkeyIndex={1} />
        </>
    )});
}