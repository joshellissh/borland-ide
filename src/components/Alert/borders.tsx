import {JSX} from "react";
import {Text} from "../Text/Text.tsx";
import {Dimensions} from "../../types.ts";

function setCharAt(str: string, index: number, char: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + char + str.substring(index+1);
}

function topBottomDecorations(dimensions: Dimensions, moving: boolean): Map<number, string> {
    const decorations = new Map<number, string>();

    if (moving) {
        for (let i = 0; i < dimensions.width; i++) {
            decorations.set(i, "color: #89fa6e;");
        }
    } else {
        decorations.set(3, "color: #89fa6e;");
    }

    return decorations;
}

function topBorder(dimensions: Dimensions, title: string, moving: boolean): string {
    let str = "";

    if (moving) { str += "┌────" }
    else { str += "╔═[■]" }

    const fillWidth = dimensions.width - 12;
    for (let i = 0; i < fillWidth; i++) {
        if (moving) { str += "─" }
        else { str += "═"; }
    }

    if (!moving) {
        const adjustedWidth = dimensions.width - 3;
        for (
            let i = Math.floor(adjustedWidth / 2) - Math.floor(title.length / 2),
                namePos = 0;

                namePos < title.length + 2;

                i++,
                namePos++
        ) {
            if (namePos == 0) {
                str = setCharAt(str, i, " ");
            } else if (namePos == title.length + 1) {
                str = setCharAt(str, i, " ");
            } else {
                str = setCharAt(str, i, title[namePos - 1]);
            }
        }
    }

    if (moving) { str += "──────┐"; }
    else { str += "══════╗"; }

    return str;
}

function leftBorder(rows: number, moving: boolean): JSX.Element[] {
    const elements = [];

    for (let i = 1; i < rows - 1; i++) {
        elements.push(<Text
            bX={0}
            bY={i}
            key={"leftBorder" + i}
            decorations={ moving ? new Map([[0, "color: #89fa6e;"]]) : new Map()}
        >{moving ? '│' : '║'}</Text>);
    }

    return elements;
}

function rightBorder(dimensions: Dimensions, moving: boolean): JSX.Element[] {
    const elements = [];

    const cols = dimensions.width;
    const rows = dimensions.height;

    for (let i = 1; i < rows - 1; i++) {
        elements.push(<Text
            bX={cols - 1}
            bY={i}
            key={"rightBorder" + i}
            decorations={ moving ? new Map([[0, "color: #89fa6e;"]]) : new Map()}
        >{moving ? '│' : '║'}</Text>);
    }

    return elements;
}

function bottomBorder(cols: number, moving: boolean): string {
    let str = "";
    
    if (moving) { str += "└"; } 
    else { str += "╚"; }

    for (let i = 1; i < cols - 1; i++) {
        if (moving) { str += "─" }
        else { str += "═"; }
    }

    if (moving) { str += "┘"; } 
    else { str += "╝"; }

    return str;
}

export function drawBorders(
    title: string,
    dimensions: Dimensions,
    moving: boolean,
): JSX.Element[] {
    const elements = [];

    elements.push(<Text
        bX={0}
        bY={0}
        decorations={topBottomDecorations(dimensions, moving)}
        key={"topBorder"}
    >{topBorder(dimensions, title, moving)}</Text>);

    elements.push(...leftBorder(dimensions.height, moving));
    elements.push(...rightBorder(dimensions, moving));

    elements.push(<Text
        bX={0}
        bY={dimensions.height - 1}
        key="bottomBorder"
        decorations={topBottomDecorations(dimensions, moving)}
    >{bottomBorder(dimensions.width, moving)}</Text>)

    return elements;
}