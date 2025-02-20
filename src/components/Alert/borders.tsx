import {JSX} from "react";
import {Text} from "../Text/Text.tsx";
import {Dimensions} from "../../types.ts";

function setCharAt(str: string, index: number, char: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + char + str.substring(index+1);
}

function topBorder(dimensions: Dimensions, title: string): string {
    let str = "╔═[■]";

    const fillWidth = dimensions.width - 12;
    for (let i = 0; i < fillWidth; i++) {
        str += "═";
    }

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

    str += "══════╗";

    return str;
}

function leftBorder(rows: number): JSX.Element[] {
    const elements = [];

    for (let i = 1; i < rows - 1; i++) {
        elements.push(<Text
            bX={0}
            bY={i}
            key={"leftBorder" + i}
        >║</Text>);
    }

    return elements;
}

function rightBorder(dimensions: Dimensions): JSX.Element[] {
    const elements = [];

    const cols = dimensions.width;
    const rows = dimensions.height;

    for (let i = 1; i < rows - 1; i++) {
        elements.push(<Text
            bX={cols - 1}
            bY={i}
            key={"rightBorder" + i}
        >║</Text>);
    }

    return elements;
}

function bottomBorder(cols: number): string {
    let str = "╚";

    for (let i = 1; i < cols - 1; i++) {
        str += "═";
    }

    str += "╝";

    return str;
}

export function drawBorders(
    title: string,
    dimensions: Dimensions
): JSX.Element[] {
    const elements = [];

    elements.push(<Text
        bX={0}
        bY={0}
        decorations={new Map<number, string>([
            [3, "color: #89fa6e;"],
        ])}
        key={"topBorder"}
    >{topBorder(dimensions, title)}</Text>);

    elements.push(...leftBorder(dimensions.height));
    elements.push(...rightBorder(dimensions));

    elements.push(<Text
        bX={0}
        bY={dimensions.height - 1}
        key="bottomBorder"
    >{bottomBorder(dimensions.width)}</Text>)

    return elements;
}