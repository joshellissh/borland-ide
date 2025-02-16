import "./SubMenu.css"
import {Text} from "../../Text/Text.tsx";
import {useAppSelector} from "../../../hooks.ts";
import {selectBlockSize} from "../../../appSlice.ts";
import {useEffect, useRef, useState} from "react";
import {XY} from "../../../types.ts";
import * as React from "react";
import {debugLog} from "../../../logger.ts";
import {useDispatch} from "react-redux";
import {activateLeftMenu, activateRightMenu, setActiveMenu} from "../../TopBar/topBarSlice.ts";

type SubMenuEntry = {
    text: string;
    hotkeyPos?: number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    action?: Function;
};

interface SubMenuProps {
    left: number;
    top: number;
    width: number;
    height: number;
    entries: (SubMenuEntry | "separator")[];
}

export default function SubMenu({left, top, width, height, entries}: SubMenuProps) {
    const blockSize = useAppSelector(selectBlockSize);
    const [selection, setSelection] = useState(0);
    const dispatch = useDispatch();

    // This prevents our component from rerendering when the mouse moves
    // But still allows us access to the cursor position
    // Yay react hacks
    const cursorPosRef = useRef<XY>({x: 0, y: 0});
    useAppSelector(
        (state) => state.cursor.livePosition,
        (_, b) => {
            cursorPosRef.current = b;
            // Prevent rerender
            return true;
        }
    );

    function border(leftChar:string, fillChar: string, rightChar: string): string {
        let str = leftChar;
        for (let i = 0; i < width - 4; i++) {
            str += fillChar;
        }
        str += rightChar;
        return str;
    }

    function subMenuString(borderChar: string, text: string): string {
        let str = borderChar + " ";
        str += text;
        str += " " + borderChar;
        return str;
    }

    function isSubMenuEntry(entry: SubMenuEntry | string): entry is SubMenuEntry {
        return (entry as SubMenuEntry).text !== undefined;
    }

    function decorations(entry: SubMenuEntry, index: number): Map<number, string> {
        const decorationMap = new Map<number, string>();

        if (index == selection) {
            for (let i = 1; i < entry.text.length + 3; i++) {
                if (entry.hotkeyPos == i - 2) {
                    decorationMap.set(i, "background-color: #4ca630;color: #a40604;");
                } else {
                    decorationMap.set(i, "background-color: #4ca630;");
                }
            }
        } else {
            for (let i = 1; i < entry.text.length + 3; i++) {
                if (entry.hotkeyPos == i - 2) {
                    decorationMap.set(i, "color: #a40604;");
                }
            }
        }

        return decorationMap;
    }

    function handleKeyDown(code: string) {
        if (code == "ArrowUp") {
            if (selection > 0) {
                if (isSubMenuEntry(entries[selection - 1])) {
                    setSelection(prevState => prevState - 1);
                } else {
                    setSelection(prevState => prevState - 2);
                }
            }
        } else if (code == "ArrowDown") {
            if (selection < entries.length - 1) {
                // Skip next entry if a separator
                if (isSubMenuEntry(entries[selection + 1])) {
                    setSelection(prevState => prevState + 1);
                } else {
                    setSelection(prevState => prevState + 2);
                }
            }
        } else if (code == "ArrowLeft") {
            dispatch(activateLeftMenu());
        }  else if (code == "ArrowRight") {
            dispatch(activateRightMenu());
        } else if (code == "Escape") {
            dispatch(setActiveMenu(-1));
        }
    }

    function handleClick(index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log("Click submenu index " + index);

        // Call action handler for submenu item
        if (entries[index] != undefined) {
            // @ts-expect-error @ts-ignore
            (entries[index] as SubMenuEntry).action();
        }

        // Close menu
        dispatch(setActiveMenu(-1));

        // Prevent click from propagating to App
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    useEffect(() => {
        debugLog("useEffect called in SubMenu");

        document.getElementById("fileMenu")!.focus();
    }, []);

    return <div
        id="fileMenu"
        tabIndex={-1}
        onKeyDown={(event) => handleKeyDown(event.code)}
    >
        <div
            className="SubMenuShadow"
            style={{
                left: (left + 2) * blockSize.width,
                top: (top + 1) * blockSize.height,
                width: width*blockSize.width,
                height: height*blockSize.height
            }}
        />
        <div
            className="bg-grey SubMenu"
            style={{
                left: left * blockSize.width,
                top: top * blockSize.height,
                width: width*blockSize.width,
                height: height*blockSize.height
            }}
        >
            <Text bX={1} bY={0} position="relative">{border("┌", "─", "┐")}</Text>

            {entries.map((entry, i) => {
                if (isSubMenuEntry(entry)) {
                    return <div
                        onClick={(event) => handleClick(i, event)}
                        key={"entry" + i}
                    >
                        <Text
                            bX={1}
                            bY={0}
                            position="relative"
                            decorations={decorations(entry, i)}
                        >
                            {subMenuString("│", (entry as SubMenuEntry).text)}
                    </Text></div>
                } else {
                    return <Text bX={1} bY={0} key={"separator" + i} position="relative">{border("├", "─", "┤")}</Text>
                }
            })}

            <Text bX={1} bY={0} position="relative">{border("└", "─", "┘")}</Text>
        </div>
    </div>;
}