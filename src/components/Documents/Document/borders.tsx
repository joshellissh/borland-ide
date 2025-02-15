import {JSX} from "react";
import {Text} from "../../Text/Text.tsx";
import {lerp} from "../../../math.ts";
import {DocumentInfo, XY} from "../../../types.ts";

function topBorder(cols: number, docInfo: DocumentInfo): string {
    let str = "╔═[■]";

    const leftLerp= lerp(3, 28, cols/80);
    for (let i = 0; i < leftLerp; i++) {
        str += "═";
    }

    str += " NONAME00.CPP ";

    const rightLerp= lerp(1, 26, cols/80);
    for (let i = 0; i < rightLerp; i++) {
        str += "═";
    }

    str += docInfo.id + 1;

    str += "═[]═╗";

    return str;
}

function leftBorder(left: number, top: number, rows: number): JSX.Element[] {
    const elements = [];
    const height = rows - top;

    for (let i = top + 2; i < height; i++) {
        elements.push(<Text
            bX={left}
            bY={i}
            key={"leftBorder" + i}
        >║</Text>);
    }

    return elements;
}

function rightBorder(left: number, top: number, cols: number, rows: number): JSX.Element[] {
    const elements = [];
    const height = rows - top;

    elements.push(<Text
        bX={cols - left - 1}
        bY={top + 2}
        key="rightBorder0"
        decorations={new Map([
            [0, "background-color: #4ba7a9;color:#000fa3;"]
        ])}
    ></Text>);
    elements.push(<Text
        bX={cols - left - 1}
        bY={top + 3}
        key="rightBorder1"
        decorations={new Map([
            [0, "background-color: #4ba7a9;color:#000fa3;"]
        ])}
    >■</Text>);

    for (let i = top + 4; i < height - 1; i++) {
        elements.push(<Text
            bX={cols - left - 1}
            bY={i}
            key={"rightBorder" + i}
            decorations={new Map([
                [0, "background-color: #000fa3;color:#4ba7a9;"]
            ])}
        >▒</Text>);
    }

    elements.push(<Text
        bX={cols - left - 1}
        bY={height - 1}
        key={Math.random()}
        decorations={new Map([
            [0, "background-color: #4ba7a9;color:#000fa3;"]
        ])}
    ></Text>);

    return elements;
}

function bottomBorder(left: number, cols: number, caretPos: XY): string {
    let str = "╚═";

    const xLen = 6 - caretPos.x.toString().length;
    const yLen = 6 - (caretPos.y - 1).toString().length;

    // Set left border
    for (let i = 0; i < yLen; i++) {
        str += "═";
    }

    str += " ";
    str += (caretPos.y - 1) + ":" + (caretPos.x);
    str += " ";

    // Set right border
    for (let i = 0; i < xLen; i++) {
        str += "═";
    }

    str += "■";

    for (let i = left + 21; i < cols - left - 2; i++) {
        str += "▒";
    }

    str += "─┘"

    return str;
}

export function drawBorders(left: number, top: number, cols: number, rows: number, caretPos: XY, docInfo: DocumentInfo): JSX.Element[] {
    const elements = [];

    elements.push(<Text
        bX={left}
        bY={top + 1}
        decorations={new Map([
            [left + 3, "color: #89fa6e;"],
            [cols - left - 4, "color: #89fa6e;"]
        ])}
        key={"topBorder"}
    >{topBorder(cols, docInfo)}</Text>);

    elements.push(...leftBorder(left, top, rows));
    elements.push(...rightBorder(left, top, cols, rows));

    const bottomDecorations = new Map<number, string>([
        [cols - left - 62, "background-color: #4ba7a9;color:#000fa3;"],
        [cols - left - 61, "background-color: #4ba7a9;color:#000fa3;"],
        [cols - left - 3, "background-color: #4ba7a9;color:#000fa3;"],
        [cols - left - 2, "background-color: #000fa3;color:#4ba7a9;"],
        [cols - left - 1, "background-color: #000fa3;color:#4ba7a9;"],
    ]);
    for (let i = left + 20; i < cols - left - 3; i++) {
        bottomDecorations.set(left + i, 'background-color: #000fa3;color:#4ba7a9;');
    }
    elements.push(<Text
        bX={left}
        bY={rows - top}
        key="bottomBorder"
        decorations={bottomDecorations}
    >{bottomBorder(left, cols, caretPos)}</Text>)

    return elements;
}