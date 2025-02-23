import {JSX} from "react";
import {Text} from "../../Text/Text.tsx";
import {DocumentInfo, XY} from "../../../types.ts";

function setCharAt(str: string, index: number, char: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + char + str.substring(index+1);
}

function topBorderDecorations(cols: number, active: boolean, moving: boolean): Map<number, string> {
    let decMap;

    if (active) {
        if (moving) {
            decMap = new Map<number, string>();    
            for (let i = 0; i < cols; i++) {
                decMap.set(i, "color: #89fa6e;");
            }
        } else {
            decMap = new Map<number, string>([
                [3, "color: #89fa6e;"],
                [cols - 4, "color: #89fa6e;"]
            ]);
        }
    } else {
        decMap = new Map<number, string>();
        for (let i = 0; i < cols; i++) {
            decMap.set(i, "color: #aaaaaa;");
        }
    }

    return decMap;
}

function topBorder(cols: number, docInfo: DocumentInfo, active: boolean, moving: boolean): string {
    let str = "";

    if (active && !moving) {
        str += "╔═[■]";
    } else {
        str += "┌────";
    }

    const fillWidth = cols - 12;
    for (let i = 0; i < fillWidth; i++) {
        if (active && !moving) {
            str += "═";
        } else {
            str += "─";
        }
    }

    if (!moving) {
        const croppedName = docInfo.name!.substring(0, docInfo.name!.length + (cols - 30));
        const adjustedWidth = cols - 3;
        for (
            let i = Math.floor(adjustedWidth / 2) - Math.floor(croppedName.length / 2),
                namePos = 0;

                namePos < croppedName.length + 2;

                i++,
                namePos++
        ) {
            if (namePos == 0) {
                str = setCharAt(str, i, " ");
            } else if (namePos == croppedName.length + 1) {
                str = setCharAt(str, i, " ");
            } else {
                str = setCharAt(str, i, croppedName[namePos - 1]);
            }
        }
    }

    if (moving) {
        str += "─";
    } else {
        if (docInfo.id < 9) {
            str += docInfo.id + 1;
        } else {
            if (active) {
                str += "═";
            } else {
                str += "─";
            }
        }
    }

    if (active && !moving) {
        if (docInfo.maximized) {
            str += "═[]═╗";
        } else {
            str += "═[]═╗";
        }
    } else {
        str += "─────┐";
    }

    return str;
}

function leftBorder(rows: number, active: boolean, moving: boolean): JSX.Element[] {
    const elements = [];

    let decMap = undefined;

    if (!active) {
        decMap = new Map<number, string>([
            [0, "color: #aaaaaa;"]
        ]);
    }

    if (moving) {
        decMap = new Map<number, string>([
            [0, "color: #89fa6e;"]
        ]);
    }

    for (let i = 1; i < rows - 1; i++) {
        elements.push(<Text
            bX={0}
            bY={i}
            key={"leftBorder" + i}
            decorations={decMap}
        >{active && !moving ? "║" : "│"}</Text>);
    }

    return elements;
}

function rightBorder(cols: number, rows: number, active: boolean, moving: boolean): JSX.Element[] {
    const elements = [];

    if (active && !moving) {
        elements.push(<Text
            bX={cols - 1}
            bY={1}
            key="rightBorder0"
            decorations={new Map([
                [0, "background-color: #4ba7a9;color:#000fa3;"]
            ])}
        ></Text>);
        elements.push(<Text
            bX={cols - 1}
            bY={2}
            key="rightBorder1"
            decorations={new Map([
                [0, "background-color: #4ba7a9;color:#000fa3;"]
            ])}
        >■</Text>);

        for (let i = 3; i < rows - 2; i++) {
            elements.push(<Text
                bX={cols - 1}
                bY={i}
                key={"rightBorder" + i}
                decorations={new Map([
                    [0, "background-color: #000fa3;color:#4ba7a9;"]
                ])}
            >▒</Text>);
        }

        elements.push(<Text
            bX={cols - 1}
            bY={rows - 2}
            key="rightBorderEnd"
            decorations={new Map([
                [0, "background-color: #4ba7a9;color:#000fa3;"]
            ])}
        ></Text>);
    } else {
        for (let i = 1; i < rows - 1; i++) {
            elements.push(<Text
                bX={cols - 1}
                bY={i}
                key={"rightBorder" + i}
                decorations={!active ? new Map([[0, "color: #aaaaaa;"]]) : new Map([[0, "color: #89fa6e;"]])}
            >│</Text>);
        }
    }

    return elements;
}

function bottomBorder(cols: number, caretPos: XY, active: boolean, moving: boolean): string {
    let str = "";

    if (active && !moving) {
        str += "╚═";
    } else {
        str += "└──"
    }

    const xLen = 6 - caretPos.x.toString().length;
    const yLen = 6 - caretPos.y.toString().length;

    // Set left border
    for (let i = 0; i < yLen; i++) {
        if (active && !moving) {
            str += "═";
        } else {
            str += "─"
        }
    }

    if (!moving) {
        str += " ";
        str += caretPos.y + ":" + caretPos.x;
        str += " ";
    } else {
        str += "──────";
    }

    // Set right border
    for (let i = 0; i < xLen; i++) {
        if (active && !moving) {
            str += "═";
        } else {
            str += "─"
        }
    }

    if (active && !moving) {
        str += "■";
    } else {
        str += "──";
    }

    for (let i = 21; i < cols - 2; i++) {
        if (active && !moving) {
            str += "▒";
        } else {
            str += "─";
        }
    }

    if (active && !moving) {
        str += "─┘";
    } else {
        str += "──┘";
    }

    return str;
}

function bottomBorderDecorations(cols: number, active: boolean, moving: boolean): Map<number, string> {
    let decMap;

    if (active && !moving) {
        decMap = new Map<number, string>([
            [18, "background-color: #4ba7a9;color:#000fa3;"],
            [19, "background-color: #4ba7a9;color:#000fa3;"],
            [cols - 3, "background-color: #4ba7a9;color:#000fa3;"],
            [cols - 2, "background-color: #000fa3;color:#4ba7a9;"],
            [cols - 1, "background-color: #000fa3;color:#4ba7a9;"],
        ]);
        for (let i = 20; i < cols - 3; i++) {
            decMap.set(i, 'background-color: #000fa3;color:#4ba7a9;');
        }
    } else {
        decMap = new Map<number, string>();
        for (let i = 0; i < cols; i++) {
            decMap.set(i, !moving ? "color: #aaaaaa;" : "color: #89fa6e;");
        }
    }

    return decMap;
}

export function drawBorders(
    cols: number,
    rows: number,
    caretPos: XY,
    docInfo: DocumentInfo,
    active: boolean,
    moving: boolean
): JSX.Element[] {
    const elements = [];

    elements.push(<Text
        bX={0}
        bY={0}
        decorations={topBorderDecorations(cols, active, moving)}
        key={"topBorder"}
    >{topBorder(cols, docInfo, active, moving)}</Text>);

    elements.push(...leftBorder(rows, active, moving));
    elements.push(...rightBorder(cols, rows, active, moving));

    elements.push(<Text
        bX={0}
        bY={rows - 1}
        key="bottomBorder"
        decorations={bottomBorderDecorations(cols, active, moving)}
    >{bottomBorder(cols, caretPos, active, moving)}</Text>)

    return elements;
}