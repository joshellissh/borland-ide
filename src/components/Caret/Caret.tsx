import "./Caret.css"
import {XY} from "../../types.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import {debugLog} from "../../logger.ts";

interface CaretProps {
    show?: boolean;
    pos: XY;
}

export function Caret({pos, show = true}: CaretProps) {
    const [visible, setVisible] = useState(false);
    const blockSize = useAppSelector(selectBlockSize);

    function blinkCaret() {
        setVisible((prevState) => {
            return !prevState;
        })
    }

    useEffect(() => {
        debugLog("useEffect called in Caret");

        const intervalId = setInterval(() => blinkCaret(), 150);
        return () => {
            clearInterval(intervalId);
        }
    }, []);


    return <div
        className="caret"
        style={{
            width: blockSize.width,
            height: blockSize.height,
            left: pos.x * blockSize.width,
            top: pos.y * blockSize.height,
            overflow: "hidden",
            visibility: visible ? "visible" : "hidden",
        }}
    >{ show ? "_" : "" }</div>;
}