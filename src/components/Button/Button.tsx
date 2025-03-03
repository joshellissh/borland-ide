import { CSSProperties, useState } from "react";
import "./Button.css"
import { Text } from "../Text/Text";
import { useAppSelector } from "../../hooks";
import { selectBlockSize } from "../../appSlice";


export interface ButtonProps {
    callback: Function;
    center?: boolean;
    horizontalPadding?: number;
    hotkeyIndex?: number;
    id?: string;
    shadow?: boolean;
    text: string;
    verticalPadding?: number;
};


export function Button({
    callback,
    center = false,
    horizontalPadding = 3, 
    hotkeyIndex,
    id,
    shadow = true, 
    text, 
    verticalPadding = 0, 
}: ButtonProps) {
    const blockSize = useAppSelector(selectBlockSize);

    const [buttonCss, setButtonCss] = useState<CSSProperties>({
        marginTop: blockSize.height,
        paddingLeft: (blockSize.width * horizontalPadding),
        paddingRight: (blockSize.width * horizontalPadding),
        paddingTop: (blockSize.height * verticalPadding),
        paddingBottom: (blockSize.height * verticalPadding),
        boxShadow: blockSize.width + "px " + (blockSize.height * 0.4) + "px rgb(0 0 0 / 75%)",
        width: blockSize.width * text.length
    });


    function buttonDecorations() {
        if (hotkeyIndex !== undefined) {
            return new Map<number, string>([
                [hotkeyIndex, "color: yellow;"],
            ]);
        }

        return new Map<number, string>();
    }


    function mouseDown() {
        setButtonCss({
            ...buttonCss,
            boxShadow: "none"
        });
    }


    function mouseUp() {
        setButtonCss({
            ...buttonCss,
            boxShadow: shadow ? blockSize.width + "px " + (blockSize.height * 0.4) + "px rgb(0 0 0 / 75%)" : "none",
        });
    }


    function focus() {
        setButtonCss({
            ...buttonCss,
            color: "white"
        });
    }


    function blur() {
        setButtonCss({
            ...buttonCss,
            color: "black"
        });
    }


    function keyDown(code: string, key: string) {
        if (code === "Enter" || code === "NumpadEnter" || code === "Space") {
            callback();
        } else if (hotkeyIndex !== undefined && key.toLowerCase() == text.at(hotkeyIndex)!.toLowerCase()) {
            callback();
        }
    }
    
    
    return <div className={"bg-dark-green Button" + (center ? " ButtonCenter " : "")}
        style={buttonCss}
        id={id}
        onClick={() => callback()}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseOut={mouseUp}
        tabIndex={0}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={(e) => keyDown(e.code, e.key)}
    >
        <Text 
            position="relative" 
            passthru={true}
            decorations={buttonDecorations()}
        >
            {text}
        </Text>
    </div>;
}