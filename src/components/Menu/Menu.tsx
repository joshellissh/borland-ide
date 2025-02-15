import "./Menu.css"
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import {MouseEventHandler, PropsWithChildren} from "react";

interface MenuProps {
    text: string;
    hotkeyPos: number[];
    bX: number;
    open: boolean;
    onClick: MouseEventHandler<HTMLDivElement>
}

export function Menu({text, hotkeyPos, bX, open, onClick, children}: PropsWithChildren<MenuProps>) {
    const blockSize = useAppSelector(selectBlockSize);
    
    function elementMarkup() {
        let markup = "";

        if (open) { markup += '<span class="bg-dark-green" style="display: inline-block;height: ' + blockSize.height + 'px">'; }

        for (let i = 0; i < text.length; i++) {
            if (hotkeyPos.includes(i)) {
                markup += '<span class="font-red char-block" style="width: ' + blockSize.width + 'px; height: ' + blockSize.height + 'px">' + text[i] + '</span>';
            } else {
                markup += '<span class="char-block" style="width: ' + blockSize.width + 'px; height: ' + blockSize.height + 'px">' + text[i] + '</span>';
            }
        }

        if (open) { markup += '</span>'; }

        return {__html: markup};
    }

    // We need to adjust the display coordinates because for some reason the font shifts left and up.
    // Hacky but seems to work for now.
    return <>
        <div
            style={{
                position: "absolute",
                left: (bX * blockSize.width) + 1,
                top: 1
            }}
            dangerouslySetInnerHTML={elementMarkup()}
            onClick={onClick}
        />
        { open && children }
    </>;
}