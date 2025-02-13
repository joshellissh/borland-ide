import {useEffect, useState} from "react";
import "./Cursor.css"
import {BlockRes, Dimensions} from "../../types.ts";

interface CursorProps {
    blockRes: BlockRes;
    dimensions: Dimensions;
    offset: number;
    cols: number;
    rows: number;
}

export function Cursor({blockRes, dimensions, offset, cols, rows}: CursorProps) {
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        document.addEventListener('mousemove', function(event) {
            if (dimensions.width == 0 || blockRes.width == 0 || dimensions.height == 0 || blockRes.height == 0) {
                return;
            }

            const blockPosX = Math.floor((event.clientX - offset) / blockRes.width);
            const blockPosY = Math.floor(event.clientY / blockRes.height);

            if (
                blockPosX < 0 || blockPosY < 0 ||
                blockPosX >= cols || blockPosY >= rows) {
                return;
            }

            const xPos = blockPosX * blockRes.width;
            const yPos = blockPosY * blockRes.height;

            setPosition({x: xPos, y: yPos});
        });
    }, [blockRes, dimensions]);

    return <div
        className="cursor bg-grey"
        style={{
            left: position.x,
            top: position.y,
            width: blockRes.width,
            height: blockRes.height
        }}
    ></div>
}