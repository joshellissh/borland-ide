import "./Caret.css"
import {XY} from "../../types.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";

interface CaretProps {
    pos: XY;
}

export function Caret({pos}: CaretProps) {
    const [visible, setVisible] = useState(false);
    const blockSize = useAppSelector(selectBlockSize);

    function blinkCaret() {
        setVisible((prevState) => {
            return !prevState;
        })
    }

    useEffect(() => {
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
            visibility: visible ? "visible" : "hidden"
        }}
    >_</div>;
}