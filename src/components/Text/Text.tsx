import "./Text.css"
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import {PropsWithChildren} from "react";

interface TextProps {
    bX: number;
    bY: number;
    decorations?: Map<number, string>;
    position?: "absolute" | "relative";
}

export function Text({bX, bY, decorations, position = "absolute", children}: PropsWithChildren<TextProps>) {
    const blockSize = useAppSelector(selectBlockSize);

    // Make sure children is only a string
    if (typeof children !== "string") {
        throw new Error("<Text> contents can only be a string! Received " + (typeof children));
    }
    const text = children as string;

    function elementMarkup() {
        let markup = "";
        const commonStyle = 'width: ' + blockSize.width + 'px; height: ' + blockSize.height + 'px;';

        for (let i = 0; i < text.length; i++) {
            const decoration = decorations?.get(i);
            if (decoration == undefined) {
                if (text[i] != " ") {
                    markup += '<span class="char-block" style="' + commonStyle + '">' + text[i] + '</span>';
                } else {
                    // Spaces do not render correctly so we just put the correct sized span here with hidden text
                    markup += '<span class="char-block" style="' + commonStyle + 'color:transparent">.</span>';
                }
            } else {
                markup += '<span class="char-block" style="' + commonStyle + '' +
                    decoration +
                    '">' + text[i] + '</span>';
            }
        }

        return {__html: markup};
    }

    // We need to adjust the display coordinates because for some reason the font shifts left and up.
    // Hacky but seems to work for now.
    return <div
        style={{
            position: position,
            left: bX * blockSize.width,
            top: bY * blockSize.height,
            height: blockSize.height,
            overflow: "hidden"
        }}
        dangerouslySetInnerHTML={elementMarkup()}
    >
    </div>;
}