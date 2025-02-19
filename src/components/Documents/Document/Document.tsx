import {DocumentInfo, XY} from "../../../types.ts";
import "./Document.css"
import {useCallback, useEffect, useRef, useState} from "react";
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
    updateDocument
} from "../documentsSlice.ts";
import {constrain} from "../../../math.ts";
import { getHighestDocument, getHighestDocumentIndex } from "./tools.ts";

interface DocumentProps {
    docInfo: DocumentInfo;
}

export function Document({docInfo}: DocumentProps) {
    debugLog("Redrawing Document " + docInfo.id);

    const blockSize = useAppSelector(selectBlockSize);
    const appCols = useAppSelector(selectCols);
    const appRows = useAppSelector(selectRows);
    const [caretPos, setCaretPos] = useState({x:0, y:0});
    const [caretVisible, ] = useState(true);
    const dispatch = useDispatch();
    const activeDoc = useAppSelector(selectActive);
    const documents = useAppSelector(selectDocuments);
    
    const moving = useRef<boolean>(false);
    const moveOffset = useRef<XY>({x:0, y:0});
    const lastPosition = useRef<XY>({x:0, y:0});
    const resizingTL = useRef<boolean>(false);
    const resizingTR = useRef<boolean>(false);
    const resizingBR = useRef<boolean>(false);
    const resizingBL = useRef<boolean>(false);
    const resizeAnchor = useRef<XY>({x:0, y:0});

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


    const left = docInfo.position!.x;
    const top = docInfo.position!.y;
    const docWidth = docInfo.size!.width;
    const docHeight = docInfo.size!.height;


    function handleClick() {
        
        // Don't do anything if we're not the active doc
        if (activeDoc != docInfo.id) {
            return;
        }

        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;

        // Check if close button is clicked
        if (cx - left >= 2 && cx - left <= 4 && cy - top == 0) {
            debugLog("Closing document " + docInfo.id);
            dispatch(closeDocument(docInfo.id));

            const nextHighestId = getHighestDocument(docInfo.id);
            if (nextHighestId != undefined) {
                const numberId = Number(nextHighestId.substring(8));
                dispatch(setActiveDocument(numberId));
            }

            return;
        } else if (docWidth - (cx - left) <= 5 &&  docWidth - (cx - left) >= 3 && cy - top == 0) {
            if (!docInfo.maximized) {
                debugLog("Maximizing document " + docInfo.id);
                dispatch(updateDocument({
                    id: docInfo.id, 
                    maximized: true, 
                    nonMaxSize:  docInfo.size, 
                    nonMaxPosition: docInfo.position, 
                    size: {width: appCols, height: appRows - 2}, 
                    position: {x: 0, y: 1}}));
            } else {
                debugLog("Restoring document " + docInfo.id);
                dispatch(updateDocument({
                    id: docInfo.id, 
                    maximized: false, 
                    size: docInfo.nonMaxSize, 
                    position: docInfo.nonMaxPosition}));
            }
            return;
        }

        const constrainedPosX = constrain(cursorPosRef.current.x - left, 1, docWidth - 2);
        const constrainedPosY = constrain(cursorPosRef.current.y - top, 1, docHeight - 2);

        setCaretPos({
            x: constrainedPosX,
            y: constrainedPosY,
        });
    }


    const dragHandler = useCallback(() => {
        console.log("Drag");
        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;
        
        // Bail out without updating if the mouse hasn't moved blocks.
        // Saves a lot of rerenders on slow movements.
        if (lastPosition.current.x == cx && lastPosition.current.y == cy) {
            return;
        }
        
        if (moving.current) {
            debugLog("Moving " + docInfo.id);

            let newX = cx - moveOffset.current.x;
            let newY = cy - moveOffset.current.y;

            console.log(newX, newY);

            if (newX < 0) {
                newX = 0;
            }

            // if (newX + docWidth > appCols) {
            //     newX = appCols - docWidth;
            // }

            if (newY < 1) {
                newY = 1;
            }

            // if (newY + docHeight > appRows - 1) {
            //     newY = appRows - docHeight - 1;
            // }

            // console.log(newX, newY);

            dispatch(updateDocument({
                id: docInfo.id,
                position: {x: newX, y: newY}
            }));
        } else if (resizingTL.current) {
            debugLog("Resizing TL " + docInfo.id);

            dispatch(updateDocument({
                id: docInfo.id,
                position: {x: cx, y: cy},
                size: {width: resizeAnchor.current.x - cx, height: resizeAnchor.current.y - cy - 1}
            }));
        } else if (resizingTR.current) {
            debugLog("Resizing TR " + docInfo.id);

            dispatch(updateDocument({
                id: docInfo.id,
                position: {x: resizeAnchor.current.x, y: cy},
                size: {width: cx - resizeAnchor.current.x + 1, height: resizeAnchor.current.y - cy - 1}
            }));
        } else if (resizingBR.current) {
            debugLog("Resizing BR " + docInfo.id);

            dispatch(updateDocument({
                id: docInfo.id,
                size: {width: cx - resizeAnchor.current.x + 1, height: cy - resizeAnchor.current.y + 1}
            }));
        } else if (resizingBL.current) {
            debugLog("Resizing BL " + docInfo.id);

            dispatch(updateDocument({
                id: docInfo.id,
                position: {x: cx, y: resizeAnchor.current.y},
                size: {width: resizeAnchor.current.x - cx, height: cy - resizeAnchor.current.y + 1}
            }));
        }

        dispatch(updateDocument({
            id: docInfo.id,
            maximized: false
        }));

        lastPosition.current = {x: cx, y: cy};
    }, []);

    
    function handleMouseDown() {
        debugLog("Mouse down on " + docInfo.id);

        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;

        // Close button
        if (cx - left >= 2 && cx - left <= 4 && cy - top == 0) {
            return;
        } 
        // Max/restore button
        else if (docWidth - (cx - left) <= 5 &&  docWidth - (cx - left) >= 3 && cy - top == 0) {
            return;
        } 
        // Top border, move window
        else if (cy - top == 0 && cx - left >= 1 && cx - left < docWidth - 1) {
            debugLog("Starting move on " + docInfo.id);
            moving.current = true;
            moveOffset.current = {
                x: cx - left,
                y: cy - top
            };
            console.log(moveOffset.current);
            document.addEventListener("mousemove", dragHandler);
        }
        // Top left corner drag
        else if (cy - top == 0 && cx - left == 0) {
            debugLog("Starting top-left resize on " + docInfo.id);
            resizingTL.current = true;
            resizeAnchor.current = {x: left + docWidth, y: top + docHeight + 1};
            console.log(top, docHeight);
            document.addEventListener("mousemove", dragHandler);
        } 
        // Top right corner drag
        else if (cy - top == 0 && cx - left >= docWidth - 1) {
            debugLog("Starting top-right resize on " + docInfo.id);
            resizingTR.current = true;
            resizeAnchor.current = {x: left, y: top + docHeight + 1};
            document.addEventListener("mousemove", dragHandler);
        }
        // Bottom right corner drag
        else if (cy - top == docHeight - 1 && (cx - left >= docWidth - 1 || cx - left >= docWidth - 2)) {
            debugLog("Starting bottom-right resize on " + docInfo.id);
            resizingBR.current = true;
            resizeAnchor.current = {x: left, y: top};
            document.addEventListener("mousemove", dragHandler);
        }
        // Bottom left corner drag
        else if (cy - top == docHeight - 1 && cx - left ==0) {
            debugLog("Starting bottom-left resize on " + docInfo.id);
            resizingBL.current = true;
            resizeAnchor.current = {x: left + docWidth, y: top};
            document.addEventListener("mousemove", dragHandler);
        }
    }


    function handleMouseUp() {
        debugLog("Mouse up on " + docInfo.id);

        document.removeEventListener("mousemove", dragHandler);
        moving.current = false;
        resizingTL.current = false;
        resizingTR.current = false;
        resizingBR.current = false;
        resizingBL.current = false;
    }


    function handleFocus() {
        debugLog("Focus on " + docInfo.id);

        const highestIndex = getHighestDocumentIndex();
        document.getElementById("document" + docInfo.id)!.style.zIndex = String(highestIndex + 1);
        dispatch(setActiveDocument(docInfo.id!));
    }


    useEffect(() => {
        debugLog("useEffect called in Document");

        // Set initial caret position to 1,1 in document
        setCaretPos({
           x: 1,
           y: 1
        });

        // New window with no size set
        if (docInfo.size!.width == -1 && docInfo.size!.height == -1) {
            let newWidth = appCols - left;
            let newHeight = appRows - top - 8;

            // Set to full size if the only open doc
            if (documents.size == 1) {
                newWidth = appCols;
                newHeight = 16;

                dispatch(updateDocument({
                    id: docInfo.id,
                    position: { x: 0, y: 1 }}));
            }

            debugLog("Setting initial document size to " + newWidth + "x" + newHeight);
            dispatch(updateDocument({
                id: docInfo.id,
                size: {width: newWidth, height: newHeight}}));

            const highestDoc = getHighestDocumentIndex();
            document.getElementById("document" + docInfo.id)!.style.zIndex = String(highestDoc + 1);
        }
    }, []);


    return (
        <div style={{
            width: blockSize.width * docWidth,
            height: blockSize.height * docHeight,
            left: blockSize.width * left,
            top: blockSize.height * top,
            zIndex: 0,
        }}
        className="bg-blue Document"
        id={"document" + docInfo.id}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        tabIndex={-1}
        onFocus={handleFocus}
        >
            {drawBorders(
                docWidth,
                docHeight,
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
            {caretVisible && activeDoc == docInfo.id && <Caret pos={caretPos} />}
        </div>
    );
}