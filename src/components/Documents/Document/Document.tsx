import {XY} from "../../../types.ts";
import "./Document.css"
import {useEffect, useRef, useState} from "react";
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
import { getHighestDocument, getHighestDocumentIndex } from "./tools.ts";
import { selectActiveMenu, setActiveMenu } from "../../TopBar/topBarSlice.ts";
import { TextEdit } from "../../TextEdit/TextEdit.tsx";
import { ScrollBar } from "../../ScrollBar/ScrollBar.tsx";

interface DocumentProps {
    id: number;
}

export function Document({id}: DocumentProps) {
    debugLog("Redrawing Document " + id);

    const blockSize = useAppSelector(selectBlockSize);
    const appCols = useAppSelector(selectCols);
    const appRows = useAppSelector(selectRows);
    const dispatch = useDispatch();
    const activeDoc = useAppSelector(selectActive);
    const documents = useAppSelector(selectDocuments);
    const activeMenu = useAppSelector(selectActiveMenu);
    
    const moving = useRef<boolean>(false);
    const moveOffset = useRef<XY>({x:0, y:0});
    const lastPosition = useRef<XY>({x:0, y:0});
    const resizingTL = useRef<boolean>(false);
    const resizingTR = useRef<boolean>(false);
    const resizingBR = useRef<boolean>(false);
    const resizingBL = useRef<boolean>(false);
    const resizeAnchor = useRef<XY>({x:0, y:0});
    const dragController = useRef<AbortController>(new AbortController());
    const [, setBorderRedraw] = useState(0);
    const [caretPos, setCaretPos] = useState({x: 1, y: 1});
    const [scrollHorizontal, setScrollHorizontal] = useState(0);
    const [scrollVertical, setScrollVertical] = useState(0);
    const [showCaret, setShowCaret] = useState(true);


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


    const doc = documents.get(id)!;
    const left = doc.position!.x;
    const top = doc.position!.y;
    const docWidth = doc.size!.width;
    const docHeight = doc.size!.height;


    function dragHandler() {
        let cx = cursorPosRef.current.x;
        let cy = cursorPosRef.current.y;

        if (cx < 0) { cx = 0; }
        if (cy < 1) { cy = 1; }
        if (cy > appRows - 2) { cy = appRows - 2; }

        if (!moving.current && !resizingBL.current && !resizingBR.current && !resizingTL.current && !resizingTR.current) {
            dragController.current.abort();
            return;
        }
        
        // Bail out without updating if the mouse hasn't moved blocks.
        // Saves a lot of rerenders on slow movements.
        if (lastPosition.current.x == cx && lastPosition.current.y == cy) {
            return;
        }

        dispatch(updateDocument({
            id: id,
            maximized: false
        }));

        lastPosition.current = {x: cx, y: cy};
        
        if (moving.current) {
            debugLog("Moving " + id);

            cx -= moveOffset.current.x;
            cy -= moveOffset.current.y;

            if (cx < 0) { cx = 0; }
            if (cy < 1) { cy = 1; }
            if (cy + docHeight > appRows - 1) { cy = appRows - docHeight - 1; }
            if (cx + docWidth > appCols) { cx = appCols - docWidth; }

            dispatch(updateDocument({
                id: id,
                position: {x: cx, y: cy}
            }));
        } else if (resizingTL.current) {
            debugLog("Resizing TL " + id);

            if (resizeAnchor.current.x - cx < 27) { cx = resizeAnchor.current.x - 27; }
            if (resizeAnchor.current.y - cy - 1 < 3) { cy = resizeAnchor.current.y - 4; }

            dispatch(updateDocument({
                id: id,
                position: {x: cx, y: cy},
                size: {width: resizeAnchor.current.x - cx, height: resizeAnchor.current.y - cy - 1}
            }));
        } else if (resizingTR.current) {
            debugLog("Resizing TR " + id);

            if (cx - resizeAnchor.current.x + 1 < 27) { cx = resizeAnchor.current.x + 26; }
            if (resizeAnchor.current.y - cy - 1 < 3) { cy = resizeAnchor.current.y - 4; }

            dispatch(updateDocument({
                id: id,
                position: {x: resizeAnchor.current.x, y: cy},
                size: {width: cx - resizeAnchor.current.x + 1, height: resizeAnchor.current.y - cy - 1}
            }));
        } else if (resizingBR.current) {
            debugLog("Resizing BR " + id);

            if (cx - resizeAnchor.current.x + 1 < 27) { cx = resizeAnchor.current.x + 26; }
            if (cy - resizeAnchor.current.y + 1 < 3) { cy = resizeAnchor.current.y + 2; }

            dispatch(updateDocument({
                id: id,
                size: {width: cx - resizeAnchor.current.x + 1, height: cy - resizeAnchor.current.y + 1}
            }));
        } else if (resizingBL.current) {
            debugLog("Resizing BL " + id);

            if (resizeAnchor.current.x - cx < 27) { cx = resizeAnchor.current.x - 27; }
            if (cy - resizeAnchor.current.y + 1 < 3) { cy = resizeAnchor.current.y + 2; }

            dispatch(updateDocument({
                id: id,
                position: {x: cx, y: resizeAnchor.current.y},
                size: {width: resizeAnchor.current.x - cx, height: cy - resizeAnchor.current.y + 1}
            }));
        }
    }

    
    function handleMouseDown() {
        debugLog("Mouse down on " + id);

        // Close menu if open
        if (activeMenu != -1) {
            dispatch(setActiveMenu(-1));
            return;
        }

        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;

        // Set doc as active if needed
        if (activeDoc != id) {
            const highestIndex = getHighestDocumentIndex();
            document.getElementById("document" + id)!.style.zIndex = String(highestIndex + 1);
            dispatch(setActiveDocument(id!));
        }

        // Close button
        if (cx - left >= 2 && cx - left <= 4 && cy - top == 0) {
            debugLog("Closing document " + id);
            dispatch(closeDocument(id));

            const nextHighestId = getHighestDocument(id);
            if (nextHighestId != undefined) {
                const numberId = Number(nextHighestId.substring(8));
                dispatch(setActiveDocument(numberId));
            }

            return;
        } 
        // Max/restore button
        else if (docWidth - (cx - left) <= 5 &&  docWidth - (cx - left) >= 3 && cy - top == 0) {
            if (docWidth - (cx - left) <= 5 &&  docWidth - (cx - left) >= 3 && cy - top == 0) {
                if (!doc.maximized) {
                    debugLog("Maximizing document " + id);
                    dispatch(updateDocument({
                        id: id, 
                        maximized: true, 
                        nonMaxSize:  doc.size, 
                        nonMaxPosition: doc.position, 
                        size: {width: appCols, height: appRows - 2}, 
                        position: {x: 0, y: 1}}));
                } else {
                    debugLog("Restoring document " + id);
                    dispatch(updateDocument({
                        id: id, 
                        maximized: false, 
                        size: doc.nonMaxSize, 
                        position: doc.nonMaxPosition}));
                }
                return;
            }
        } 
        // Top border, move window
        else if (cy - top == 0 && cx - left >= 1 && cx - left < docWidth - 1) {
            debugLog("Starting move on " + id);
            moving.current = true;
            moveOffset.current = {
                x: cx - left,
                y: cy - top
            };
            setBorderRedraw(prevState => prevState + 1);
            dragController.current = new AbortController();
            document.addEventListener("mousemove", dragHandler, {signal: dragController.current.signal});
        }
        // Top left corner drag
        else if (cy - top == 0 && cx - left == 0) {
            debugLog("Starting top-left resize on " + id);
            resizingTL.current = true;
            resizeAnchor.current = {x: left + docWidth, y: top + docHeight + 1};
            dragController.current = new AbortController();
            document.addEventListener("mousemove", dragHandler, {signal: dragController.current.signal});
        } 
        // Top right corner drag
        else if (cy - top == 0 && cx - left >= docWidth - 1) {
            debugLog("Starting top-right resize on " + id);
            resizingTR.current = true;
            resizeAnchor.current = {x: left, y: top + docHeight + 1};
            dragController.current = new AbortController();
            document.addEventListener("mousemove", dragHandler, {signal: dragController.current.signal});
        }
        // Bottom right corner drag
        else if (cy - top == docHeight - 1 && (cx - left >= docWidth - 1 || cx - left >= docWidth - 2)) {
            debugLog("Starting bottom-right resize on " + id);
            resizingBR.current = true;
            resizeAnchor.current = {x: left, y: top};
            dragController.current = new AbortController();
            document.addEventListener("mousemove", dragHandler, {signal: dragController.current.signal});
        }
        // Bottom left corner drag
        else if (cy - top == docHeight - 1 && cx - left ==0) {
            debugLog("Starting bottom-left resize on " + id);
            resizingBL.current = true;
            resizeAnchor.current = {x: left + docWidth, y: top};
            dragController.current = new AbortController();
            document.addEventListener("mousemove", dragHandler, {signal: dragController.current.signal});
        }
    }


    function handleMouseUp() {
        debugLog("Mouse up on " + id);

        dragController.current.abort();
        moving.current = false;
        resizingTL.current = false;
        resizingTR.current = false;
        resizingBR.current = false;
        resizingBL.current = false;
        setBorderRedraw(prevState => prevState + 1);
    }


    function handleFocus() {
        debugLog("Focus on " + id);

        setShowCaret(true);

        const highestIndex = getHighestDocumentIndex();

        if (highestIndex == id) { return; }

        document.getElementById("document" + id)!.style.zIndex = String(highestIndex + 1);
        dispatch(setActiveDocument(id!));

        document.getElementById("TextEdit" + id)?.focus();
    }


    function handleBlur() {
        debugLog("Blur on " + id);

        setShowCaret(false);
    }


    function handleScroll(direction: string, scrollPercent: number) {
        debugLog("Scroll " + direction + " " + scrollPercent);

        if (direction == "horizontal") { setScrollHorizontal(scrollPercent * -1024); }
        else if (direction == "vertical") { setScrollVertical(scrollPercent * -1024); }
    }


    useEffect(() => {
        debugLog("useEffect called in Document");

        // New window with no size set
        if (doc.size!.width == -1 && doc.size!.height == -1) {
            let newWidth = appCols - left;
            let newHeight = appRows - top - 8;

            // Set to full size if the only open doc
            if (documents.size == 1) {
                newWidth = appCols;
                newHeight = 16;

                dispatch(updateDocument({
                    id: id,
                    position: { x: 0, y: 1 }}));
            }

            debugLog("Setting initial document size to " + newWidth + "x" + newHeight);
            dispatch(updateDocument({
                id: id,
                size: {width: newWidth, height: newHeight}}));

            const highestDoc = getHighestDocumentIndex();
            document.getElementById("document" + id)!.style.zIndex = String(highestDoc + 1);
        }

        // Focus on editor
        document.getElementById("TextEdit" + id)?.focus();
    }, []);


    return (
        <div style={{
            width: blockSize.width * docWidth,
            height: blockSize.height * docHeight,
            left: blockSize.width * left,
            top: blockSize.height * top,
            zIndex: 0,
            overflow: "hidden"
        }}
        className="bg-blue Document"
        id={"document" + id}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        tabIndex={-1}
        onFocus={handleFocus}
        onBlur={handleBlur}
        >
            {drawBorders(
                docWidth,
                docHeight,
                caretPos,
                documents.get(id)!,
                activeDoc == id,
                moving.current || resizingBL.current || resizingBR.current || resizingTL.current || resizingTR.current,
            )}
            <div style={{
                position: "relative",
                left: blockSize.width,
                top: blockSize.height,
                width: blockSize.width * (docWidth - 2),
                height: blockSize.height * (docHeight - 2),
                overflow: "hidden"
            }}>
                <TextEdit width={1024} id={id} caretCallback={setCaretPos} showCaret={showCaret}
                    style={{
                        position: "relative",
                        left: blockSize.width * scrollHorizontal,
                        top: blockSize.height * scrollVertical,
                    }}
                />
            </div>
            <ScrollBar 
                width={docWidth - 20} 
                height={1} 
                range={1024}
                left={18}
                top={1}
                scrollCallback={handleScroll}
                docLeft={left}
                docTop={top}
            />
            <ScrollBar 
                width={1} 
                height={docHeight - 2} 
                range={1024}
                left={docWidth - 1}
                top={1}
                scrollCallback={handleScroll}
                orientation="vertical"
                cssPosition="absolute"
                docLeft={left}
                docTop={top}
            />
        </div>
    );
}
