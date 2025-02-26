import { ReactElement, useEffect, useRef, useState } from "react";
import { selectBlockSize } from "../../appSlice";
import { useAppSelector } from "../../hooks";
import { Text } from "../Text/Text"
import "./ScrollBar.css"
import { XY } from "../../types";
import { debugLog } from "../../logger";
import { findClosestMultiple } from "../../math";


export interface ScrollBarProps {
    cssPosition?: "absolute" | "relative";
    orientation?: "horizontal" | "vertical";
    width: number;
    height: number;
    range: number;
    left?: number;
    top?: number;
    scrollCallback: Function;
    docLeft: number;
    docTop: number;
};


export function ScrollBar({cssPosition = "relative", orientation = "horizontal", width, height, range, left = 0, top = 0, scrollCallback, docLeft, docTop}: ScrollBarProps) {
    const blockSize = useAppSelector(selectBlockSize);
    const [scrollPercent, setScrollPercent] = useState(0);
    const mouseDown = useRef<boolean>(false);
    let dragAbort = new AbortController();
    const lastPosition = useRef<XY>({x:0, y:0});
    const scrollStep = 1 / range;


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
    

    function generateHorizontal(): string {
        let str = "";

        for (let i = 0; i < width - 2; i++) {
            str += "▒";
        }

        return str;
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

        if (mouseDown.current) {
            if (orientation == "horizontal") {
                debugLog("Moving horizontal scroll handle");
                let newOffset = cx - left - docLeft;

                // Constrain to scroll size
                if (newOffset < 1) { newOffset = 1; }
                if (newOffset > width - 2) { newOffset = width - 2; }

                const newPercent = (newOffset - 1)/ (width - 3);

                setScrollPercent(newPercent);
                scrollCallback("horizontal", newPercent);
            } else if (orientation == "vertical") {
                debugLog("Moving vertical scroll handle");
                let newOffset = cy - top - docTop - 1;

                // Constrain to scroll size
                if (newOffset < 0) { newOffset = 0; }
                if (newOffset > height - 3) { newOffset = height - 3; }

                const newPercent = newOffset / (height - 3);

                setScrollPercent(newPercent);
                scrollCallback("vertical", newPercent);
            }
        }
    }

    
    function handleMouseDown() {
        debugLog("Scroll mouse down");
        mouseDown.current = true;
        dragAbort = new AbortController();
        document.addEventListener("mousemove", handleDrag, { signal: dragAbort.signal });
        document.addEventListener("mouseup", handleMouseUp, { once: true });
    }


    function handleMouseUp() {
        debugLog("Scroll mouse up");
        mouseDown.current = false;
        dragAbort.abort();
    }


    function generateVerticalBG(): ReactElement[] {
        const elements: ReactElement[] = [];

        for (let i = 1; i < height - 1; i++) {
            elements.push(<Text bX={0} bY={i} position="absolute" key={"vpg" + (i - 2)} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])}>▒</Text>)
        }

        return elements;
    }


    function generateHorizontalDecorations(): Map<number, string> {
        const decMap = new Map<number, string>();

        for (let i = 0; i < width - 1; i++) {
            decMap.set(i, "background-color: #4ba7a9;color:#000fa3;");
        }

        return decMap;
    }


    function handleLeftScroll() {
        debugLog("Left scroll button");

        let newPercent = scrollPercent - scrollStep;

        if (newPercent < 0) { newPercent = 0; }

        setScrollPercent(newPercent);
        scrollCallback("horizontal", newPercent);
    }


    function handleRightScroll() {
        debugLog("Right scroll button");

        let newPercent = scrollPercent + scrollStep;

        if (newPercent > 1) { newPercent = 1; }

        setScrollPercent(newPercent);
        scrollCallback("horizontal", newPercent);
    }


    function handleUpScroll() {
        debugLog("Up scroll button");

        let newPercent = scrollPercent - scrollStep;

        if (newPercent < 0) {  newPercent = 0; }

        setScrollPercent(newPercent);
        scrollCallback("vertical", newPercent);
    }


    function handleDownScroll() {
        debugLog("Down scroll button");

        let newPercent = scrollPercent + scrollStep;

        if (newPercent > 1) { newPercent = 1; }

        setScrollPercent(newPercent);
        scrollCallback("vertical", newPercent);
    }


    useEffect(() => {
        debugLog("Redrawing scrollbar");
    }, [width, height]);


    if (orientation == "horizontal") {
        return (
            <div style={{
                position: cssPosition,
                width: blockSize.width * width,
                height: blockSize.height * height,
                left: blockSize.width * left,
                top: blockSize.height * top,
                display: "flex",
                flexDirection: "row"
            }}>
                <div onClick={handleLeftScroll}>
                    <Text bX={0} bY={0} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])} position="relative" passthru={true}></Text>
                </div>

                <Text bX={0} bY={0} position="relative" decorations={generateHorizontalDecorations()}>{generateHorizontal()}</Text>

                <div onClick={handleRightScroll}>
                    <Text bX={0} bY={0} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])} position="relative" passthru={true}></Text>
                </div>
                <div style={{
                    position: "absolute",
                    left: blockSize.width + findClosestMultiple(scrollPercent * (width - 3) * blockSize.width, blockSize.width),
                    width: blockSize.width,
                    height: blockSize.height
                }} 
                className="ScrollHandle"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                >■</div>
            </div>
        );
    } else if (orientation == "vertical") {
        return (
            <div style={{
                position: cssPosition,
                width: blockSize.width * width,
                height: blockSize.height * height,
                left: blockSize.width * left,
                top: blockSize.height * top,
                display: "flex",
                flexDirection: "column"
            }}>
                <div onClick={handleUpScroll}>
                    <Text bX={0} bY={0} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])} position="relative" passthru={true}></Text>
                </div>
                <div onClick={handleDownScroll} style={{
                    position: "absolute",
                    width: blockSize.width,
                    height: blockSize.height,
                    top: (height - 1) * blockSize.height,
                }}>
                    <Text bX={0} bY={0} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])} passthru={true}></Text>
                </div>

                {generateVerticalBG()}

                <div onClick={handleDownScroll}>
                    <Text bX={0} bY={height - 1} decorations={new Map<number, string>([[0, "background-color: #4ba7a9;color:#000fa3;"]])} position="absolute" passthru={true}></Text>
                </div>
                <div style={{
                    position: "absolute",
                    top: blockSize.height + findClosestMultiple((scrollPercent * (height - 3) * blockSize.height), blockSize.height),
                    width: blockSize.width,
                    height: blockSize.height
                }} 
                className="ScrollHandle"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                >■</div>
            </div>
        );
    }
}