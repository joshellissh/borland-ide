import {useEffect} from "react";
import "./Cursor.css"
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {selectLivePosition, setLivePosition} from "./cursorSlice.ts";
import {selectBlockSize, selectCols, selectDimensions, selectLeftOffset, selectRows} from "../../appSlice.ts";

export function Cursor() {
    const dispatch = useAppDispatch();
    const cursorPosition = useAppSelector(selectLivePosition);
    const dimensions = useAppSelector(selectDimensions);
    const blockSize = useAppSelector(selectBlockSize);
    const cols = useAppSelector(selectCols);
    const rows = useAppSelector(selectRows);
    const leftOffset = useAppSelector(selectLeftOffset);

    useEffect(() => {
        document.addEventListener('mousemove', function(event) {
            if (dimensions.width == 0 || blockSize.width == 0 || dimensions.height == 0 || blockSize.height == 0) {
                return;
            }

            const blockPosX = Math.floor((event.clientX - leftOffset) / blockSize.width);
            const blockPosY = Math.floor(event.clientY / blockSize.height);

            if (
                blockPosX < 0 || blockPosY < 0 ||
                blockPosX >= cols || blockPosY >= rows) {
                return;
            }

            dispatch(setLivePosition({x: blockPosX, y: blockPosY}));
        });
    }, [blockSize, dimensions]);

    return <div
        className="cursor bg-grey"
        style={{
            left: cursorPosition.x * blockSize.width,
            top: cursorPosition.y * blockSize.height,
            width: blockSize.width,
            height: blockSize.height
        }}
    ></div>
}