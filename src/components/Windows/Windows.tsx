import { Dispatch } from "react";
import { useAppSelector } from "../../hooks";
import { selectWindows, windowClose, windowOpen } from "./windowsSlice";
import { UnknownAction } from "@reduxjs/toolkit";
import { Window, WindowProps } from './Window/Window.tsx';
import React from "react";

export function Windows() {
    const windows = useAppSelector(selectWindows);
    return Array(...windows.values());
}

export function openWindow(dispatch: Dispatch<UnknownAction>, props: WindowProps) {
    dispatch(windowOpen({
        key: props.name, 
        value: React.createElement(Window, {...props, key: "windowKey" + Math.round(Math.random() * 99999)})
    }));
}

export function closeWindow(dispatch: Dispatch<UnknownAction>, key: string) {
    dispatch(windowClose(key));
}