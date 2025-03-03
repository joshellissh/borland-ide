import { ReactNode, useEffect, useRef, useState } from "react";
import "./Window.css"
import { Dimensions, XY } from "../../../types";
import { useAppSelector } from "../../../hooks";
import { selectBlockSize, selectCols, selectRows } from "../../../appSlice";
import { drawBorders } from "./borders";
import { debugLog } from "../../../logger";
import { windowClose } from "../windowsSlice";
import { useDispatch } from "react-redux";

export interface WindowProps {
    border?: boolean;
    center?: boolean;
    contents: ReactNode;
    closeCallback?: Function;
    dimensions: Dimensions;
    focusElement?: string;
    initialPosition?: XY;
    modal?: boolean;
    name: string;
    resizeable?: boolean;
    shadow?: boolean;
    title?: string;
}

export function Window({
    border = true,
    center = false,
    closeCallback,
    dimensions,
    focusElement,
    modal = false,
    name,
    title = "",
    shadow = true,
    contents
}: WindowProps) {
    const blockSize = useAppSelector(selectBlockSize);
    const appCols = useAppSelector(selectCols);
    const appRows = useAppSelector(selectRows);
    const dispatch = useDispatch();

    const [moving, setMoving] = useState(false);
    const moveCursorOffset = useRef<number>(0);
    const position = useRef<XY>({x: 0, y: 0});
    const lastPosition = useRef<XY>({x:0, y:0});

    const moveAbort = useRef<AbortController>(new AbortController());
    const windowId = useRef<number>(Math.round(Math.random() * 99999));

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


    function handleMouseDown() {
        if (cursorPosRef.current.x - position.current.x >= 2  && cursorPosRef.current.x - position.current.x <= 4 && cursorPosRef.current.y - position.current.y == 0) {
            debugLog("Window close clicked");

            if (closeCallback !== undefined) { closeCallback(); }
            
            dispatch(windowClose(name));

            return;
        }

        if (cursorPosRef.current.y - position.current.y == 0) {
            debugLog("Mouse down on top border of Window")

            setMoving(true);
            moveCursorOffset.current = cursorPosRef.current.x - position.current.x;
            moveAbort.current = new AbortController();
            window.addEventListener("mousemove", handleDrag, {signal: moveAbort.current.signal});
        }
    }


    function handleMouseUp() {
        setMoving(false);
        moveAbort.current.abort();
    }


    function handleKeyDown(code: string) {
        if (code === "Escape") {
            if (closeCallback !== undefined) { closeCallback(); }
            
            dispatch(windowClose(name));
        }
    }


    function handleDrag() {
        const cx = cursorPosRef.current.x;
        const cy = cursorPosRef.current.y;
        
        // Bail out without updating if the mouse hasn't moved blocks.
        // Saves a lot of rerenders on slow movements.
        if (lastPosition.current.x == cx && lastPosition.current.y == cy) {
            return;
        }

        lastPosition.current = {x: cx, y: cy};

        debugLog("Dragging Window");

        if (cursorPosRef.current.x - moveCursorOffset.current < 0) { return; }
        if (cursorPosRef.current.y < 1) { return; }
        if (cursorPosRef.current.x - moveCursorOffset.current + dimensions.width > appCols) { return; }
        if (cursorPosRef.current.y + dimensions.height > appRows - 1) { return; }

        position.current.x = cursorPosRef.current.x - moveCursorOffset.current;
        position.current.y = cursorPosRef.current.y;

        document.getElementById("window-" + windowId.current)!.style.left = (position.current.x * blockSize.width) + "px";
        document.getElementById("window-" + windowId.current)!.style.top = (position.current.y * blockSize.height) + "px";
    }

    
    useEffect(() => {
        // Center div on initial load or if not moved
        if (center && !moveAbort.current.signal.aborted) {
            position.current.x = Math.round((appCols / 2) - (dimensions.width) / 2);
            position.current.y = Math.round((appRows / 2) - (dimensions.height) / 2);

            lastPosition.current = position.current;

            document.getElementById("window-" + windowId.current)!.style.left = (position.current.x * blockSize.width) + "px";
            document.getElementById("window-" + windowId.current)!.style.top = (position.current.y * blockSize.height) + "px";
        }

        // Set initial focus if requested
        if (focusElement !== undefined) {
            const element = document.getElementById(focusElement);
            if (element !== null) {
                element.focus();
            }
        }

    }, [appCols, appRows]);

    
    return (<>
        { modal && <div className="ModalCurtain"></div>}
        <div
            style={{
                width: blockSize.width * dimensions.width,
                height: blockSize.height * dimensions.height,
                boxShadow: (shadow && !moving) ? (blockSize.width*2) + "px " + blockSize.height + "px rgb(0 0 0 / 75%)" : ""
            }}
            className="Window bg-grey"
            id={"window-" + windowId.current}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onKeyDown={(e) => handleKeyDown(e.code)}
        >
            {border && drawBorders(title, dimensions, moving)}
            <div style={{
                position: "relative",
                color: "black",
                left: blockSize.width,
                top: blockSize.height,
                width: blockSize.width * (dimensions.width - 2),
                height: blockSize.height * (dimensions.height - 2)
            }}
            >
                {contents}
            </div>
        </div>
    </>
    );
}