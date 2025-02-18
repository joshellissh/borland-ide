import {DocumentInfo, XY} from "../../../types.ts";
import "./Document.css"
import {useEffect, useRef, useState} from "react";
import {Caret} from "../../Caret/Caret.tsx";
import {useAppSelector} from "../../../hooks.ts";
import {selectBlockSize, selectCols, selectRows} from "../../../appSlice.ts";
import {drawBorders} from "./borders.tsx";
import {debugLog} from "../../../logger.ts";
import {useDispatch} from "react-redux";
import {
    closeDocument,
    selectActive,
    selectDocuments,
    setActiveDocument,
    setDocumentPosition,
    setDocumentSize,
    maximizeDocument
} from "../documentsSlice.ts";
import {constrain} from "../../../math.ts";

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
    const dispatch = useDispatch();
    const activeDoc = useAppSelector(selectActive);
    const documents = useAppSelector(selectDocuments);

    // This prevents our component from rerendering when the mouse moves
    // But still allows us access to the cursor position
    const cursorPosRef = useRef<XY>({x: 0, y: 0});
    useAppSelector(
        (state) => state.cursor.livePosition,
        (_, b) => {
            cursorPosRef.current = b;
            // Prevent rerender
            return true;
        }
    );


    const left = docInfo.docPos.x;
    const top = docInfo.docPos.y;
    const cols = docInfo.docSize.width;
    const rows = docInfo.docSize.height;


    function handleClick() {
        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;

        // Check if close button is clicked
        if (activeDoc == docInfo.id && cx - left >= 2 && cx - left <= 4 && cy - top == 0) {
            debugLog("Closing document " + docInfo.id);
            dispatch(closeDocument(docInfo.id));

            const nextHighestId = getHighestDocument(docInfo.id);
            if (nextHighestId != undefined) {
                const numberId = Number(nextHighestId.substring(8));
                dispatch(setActiveDocument(numberId));
            }

            return;
        } else if (activeDoc == docInfo.id && cols - (cx - left) <= 5 &&  cols - (cx - left) >= 3 && cy - top == 0) {
            if (!docInfo.maximized) {
                debugLog("Maximizing document " + docInfo.id);
                dispatch(maximizeDocument({docNum: docInfo.id, maxSize: {width: appCols, height: appRows - 2}}));
            } else {
                debugLog("Restoring document " + docInfo.id);
                dispatch(setDocumentSize({docNum: docInfo.id, dimensions: docInfo.nonMaxDimensions!}));
                dispatch(setDocumentPosition({docNum: docInfo.id, pos: docInfo.nonMaxPos!}));
            }
        }

        const constrainedPosX = constrain(cursorPosRef.current.x - left, 1, cols - 2);
        const constrainedPosY = constrain(cursorPosRef.current.y - top, 1, rows - 2);

        setCaretPos({
            x: constrainedPosX,
            y: constrainedPosY,
        });
    }


    function handleFocus() {
        debugLog("Focus on " + docInfo.id);

        const highestIndex = getHighestDocumentIndex();
        document.getElementById("document" + docInfo.id)!.style.zIndex = String(highestIndex + 1);
        dispatch(setActiveDocument(docInfo.id));
    }


    function getHighestDocument(excludeId: number): string | undefined {
        let maxZ = 0;
        let maxElem: Element | undefined = undefined;

        document.querySelectorAll('.Document:not(#document' + excludeId + ')').forEach(element => {
            const z = parseInt(window.getComputedStyle(element).zIndex);
            if (!isNaN(z)) {
                maxZ = Math.max(maxZ, z);
                maxElem = element;
            }
        });

        if (maxElem == undefined) {
            return undefined;
        }

        return (maxElem as Element).id;
    }


    function getHighestDocumentIndex(): number {
        let maxZ = 0;
        document.querySelectorAll('.Document').forEach(element => {
            const z = parseInt(window.getComputedStyle(element).zIndex);
            if (!isNaN(z)) {
                maxZ = Math.max(maxZ, z);
            }
        });
        return maxZ;
    }


    useEffect(() => {
        debugLog("useEffect called in Document");

        // Set initial caret position to 1,1 in document
        setCaretPos({
           x: 1,
           y: 1
        });

        // New window with no size set
        if (docInfo.docSize.width == -1 && docInfo.docSize.height == -1) {
            let newWidth = appCols - left;
            let newHeight = appRows - top - 8;

            // Set to full size if the only open doc
            if (documents.size == 1) {
                newWidth = appCols;
                newHeight = 16;

                console.log("Only doc");
                dispatch(setDocumentPosition({docNum: docInfo.id, pos: { x: 0, y: 1 }}));
            }

            debugLog("Setting initial document size to " + newWidth + "x" + newHeight);
            dispatch(setDocumentSize({docNum: docInfo.id, dimensions: {width: newWidth, height: newHeight}}));

            const highestDoc = getHighestDocumentIndex();
            document.getElementById("document" + docInfo.id)!.style.zIndex = String(highestDoc + 1);
        }
    }, []);


    return (
        <div style={{
            width: blockSize.width * cols,
            height: blockSize.height * rows,
            left: blockSize.width * left,
            top: blockSize.height * top,
            zIndex: 0,
        }}
        className="bg-blue Document"
        id={"document" + docInfo.id}
        onClick={handleClick}
        tabIndex={-1}
        onFocus={handleFocus}
        >
            {drawBorders(
                cols,
                rows,
                caretPos,
                docInfo,
                activeDoc == docInfo.id
            )}
            <div style={{
                position: "relative",
                left: blockSize.width,
                top: blockSize.height
            }}
            >
            </div>
            {caretVisible && <Caret pos={caretPos} />}
        </div>
    );
}