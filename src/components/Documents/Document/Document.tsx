import {DocumentInfo, XY} from "../../../types.ts";
import "./Document.css"
import {useEffect, useRef, useState} from "react";
import {Caret} from "../../Caret/Caret.tsx";
import {useAppSelector} from "../../../hooks.ts";
import {selectBlockSize, selectCols, selectRows} from "../../../appSlice.ts";
import {drawBorders} from "./borders.tsx";

interface DocumentProps {
    docInfo: DocumentInfo;
}

export function Document({docInfo}: DocumentProps) {
    console.log("Redrawing Document " + docInfo.id);

    const blockSize = useAppSelector(selectBlockSize);
    const appCols = useAppSelector(selectCols);
    const appRows = useAppSelector(selectRows);
    const [caretPos, setCaretPos] = useState({x:0, y:0});
    const [caretVisible, ] = useState(true);

    // This prevents our component from rerendering when the mouse moves
    // But still allows us access to the cursor position
    const cursorPosRef = useRef<XY>({x: 0, y: 0});
    useAppSelector(
        (state) => state.cursor.position,
        (_, b) => {
            cursorPosRef.current = b;
            // Prevent rerender
            return true;
        }
    );

    const left = docInfo.docPos.x;
    const top = docInfo.docPos.y;
    let cols = docInfo.docSize.width;
    let rows = docInfo.docSize.height;

    // Correct any sizes which go out of bounds
    if (cols - left > appCols) {
        cols = appCols - left;
    }
    if (rows - top > appRows) {
        rows = appRows - top;
    }

    // Set minimums
    if (cols < 27) {
        cols = 27;
    }
    if (rows < 3) {
        rows = 3;
    }

    function handleClick() {
        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;

        if (cx < left + 1 || cx > cols - left - 2) {
            return;
        }
        if (cy < top + 2 || cy > rows - top - 1) {
            return;
        }


        setCaretPos(cursorPosRef.current);
    }

    useEffect(() => {
        // Set initial caret position to 1,1 in document
        setCaretPos({
           x: left + 1,
           y: top + 2
        });
    }, [left, top]);

    return (
        <div style={{
            width: blockSize.width * cols,
            height: blockSize.height * rows
        }}
        className="bg-blue Document"
        onClick={handleClick}
        >
            {drawBorders(
                left,
                top,
                cols,
                rows,
                caretPos,
                docInfo
            )}
            <div style={{
                position: "relative",
                left: blockSize.width * 1,
                top: blockSize.height * 1,
            }}
            >
            </div>
            {caretVisible && <Caret pos={caretPos} />}
        </div>
    );
}