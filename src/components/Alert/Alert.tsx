import { CSSProperties, useEffect, useRef, useState } from "react";
import { selectBlockSize, selectCols, selectRows } from "../../appSlice";
import { useAppSelector } from "../../hooks";
import { Dimensions, XY } from "../../types";
import "./Alert.css";
import { drawBorders } from "./borders";
import { Text } from "../Text/Text";
import { debugLog } from "../../logger";

export interface AlertProps {
    title: string;
    message: string;
    dimensions: Dimensions;
    buttonText: string;
    buttonHotkey?: number;
    closeCallback: () => void;
    buttonCallback?: () => void;
};

export function Alert({title, message, dimensions, buttonText, buttonHotkey, closeCallback, buttonCallback}: AlertProps) {
    const blockSize = useAppSelector(selectBlockSize);
    const appCols = useAppSelector(selectCols);
    const appRows = useAppSelector(selectRows);
    const position = useRef<XY>({x: 0, y: 0});

    const [buttonCss, setButtonCss] = useState<CSSProperties>({
        marginTop: blockSize.height,
        paddingLeft: (blockSize.width * 3),
        paddingRight: (blockSize.width * 3),
        boxShadow: blockSize.width + "px " + (blockSize.height * 0.4) + "px rgb(0 0 0 / 75%)",
        width: blockSize.width * buttonText.length
    });
        

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


    function buttonDecorations() {
        if (buttonHotkey !== undefined) {
            return new Map<number, string>([
                [buttonHotkey, "color: yellow;"],
            ]);
        }

        return new Map<number, string>();
    }


    function handleClick() {
        if (cursorPosRef.current.x - position.current.x == 3 && cursorPosRef.current.y - position.current.y == 0) {
            debugLog("Alert closed clicked");
            closeCallback();
        }
    }

    
    function buttonMouseDown() {
        setButtonCss({
            marginTop: blockSize.height,
            paddingLeft: (blockSize.width * 3),
            paddingRight: (blockSize.width * 3),
            width: blockSize.width * buttonText.length
        });
    }


    function buttonMouseUp() {
        setButtonCss({
            marginTop: blockSize.height,
            paddingLeft: (blockSize.width * 3),
            paddingRight: (blockSize.width * 3),
            boxShadow: blockSize.width + "px " + (blockSize.height * 0.4) + "px rgb(0 0 0 / 75%)",
            width: blockSize.width * buttonText.length
        });
    }

    
    useEffect(() => {
        // Center div
        position.current.x = ((appCols / 2) - (dimensions.width) / 2);
        position.current.y = ((appRows/ 2) - (dimensions.height) / 2);

        document.getElementById("alert-" + title)!.style.left = ((appCols * blockSize.width) / 2) - ((blockSize.width * dimensions.width) / 2) + "px";
        document.getElementById("alert-" + title)!.style.top = ((appRows * blockSize.height) / 2) - ((blockSize.height * dimensions.height) / 2) + "px";
    }, [appCols, blockSize]);

    
    return (<div
        style={{
            position: "absolute",
            zIndex: 98,
            top: 0,
            left: 0,
            width: blockSize.width * appCols,
            height: blockSize.height * appRows,
        }}>
            <div
            className="Alert bg-grey"
            id={"alert-" + title}
            style={{
                position: "absolute",
                width: blockSize.width * dimensions.width,
                height: blockSize.height * dimensions.height,
                boxShadow: (blockSize.width*2) + "px " + blockSize.height + "px rgb(0 0 0 / 75%)"
            }}
            onClick={handleClick}
            >
                {drawBorders(title, dimensions)}
                <div style={{
                    position: "relative",
                    left: blockSize.width,
                    top: blockSize.height,
                    color: "black",
                    width: blockSize.width * (dimensions.width - 2),
                    height: blockSize.height * (dimensions.height - 2),
                }}
                >
                    <Text bX={0} bY={0} position="relative">{message}</Text>

                    <div className="bg-dark-green AlertButton"
                        style={buttonCss}
                        onClick={buttonCallback}
                        onMouseDown={buttonMouseDown}
                        onMouseUp={buttonMouseUp}
                        onMouseOut={buttonMouseUp}
                    >
                        <Text bX={0} bY={0} position="relative" 
                        decorations={buttonDecorations()}
                        >
                            {buttonText}
                        </Text>
                    </div>
                </div>
            </div>
        </div>);
}