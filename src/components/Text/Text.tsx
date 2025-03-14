import "./Text.css"
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import {PropsWithChildren} from "react";

interface TextProps {
    bX?: number;
    bY?: number;
    decorations?: Map<number, string>;
    position?: "absolute" | "relative";
    passthru?: boolean;
}

export function Text({bX = 0, bY = 0, decorations, position = "absolute", passthru = false, children}: PropsWithChildren<TextProps>) {
    const blockSize = useAppSelector(selectBlockSize);

    // Make sure children is only a string
    if (typeof children !== "string") {
        throw new Error("<Text> contents can only be a string! Received " + (typeof children));
    }
    const text = children as string;


    function createLines() {
        const lines = text.split("\n");
        let markup = "";
        for (let i = 0; i < lines.length; i++) {
            markup += '<div style="height: ' + blockSize.height + 'px;top:' + (blockSize.height * i) + '">' + elementMarkup(lines[i]) + '</div>';
        }

        return {__html: markup};
    }


    function elementMarkup(line: string): string {
        let markup = "";
        const commonStyle = 'width: ' + blockSize.width + 'px; height: ' + blockSize.height + 'px;';

        for (let i = 0; i < line.length; i++) {
            const decoration = decorations?.get(i);
            if (decoration == undefined) {
                if (line[i] != " ") {
                    markup += '<span class="char-block" style="' + commonStyle + '">' + line[i] + '</span>';
                } else {
                    // Spaces do not render correctly so we just put the correct sized span here with hidden text
                    markup += '<span class="char-block" style="' + commonStyle + 'color:transparent">.</span>';
                }
            } else {
                markup += '<span class="char-block" style="' + commonStyle + '' +
                    decoration +
                    '">' + line[i] + '</span>';
            }
        }

        return markup;
    }


    return (<div
        style={{
            position: position,
            left: bX * blockSize.width,
            top: bY * blockSize.height,
            height: blockSize.height * (text.split("\n").length),
            overflow: "hidden",
            pointerEvents: passthru ? "none" : "auto"
        }}
        dangerouslySetInnerHTML={createLines()}
        >
        </div>);
}