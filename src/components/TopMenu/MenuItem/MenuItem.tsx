import {BlockRes} from "../../../types.ts";
import "./MenuItem.css"

interface MenuItemProps {
    text: string;
    hotkeyPos: number;
    bX: number;
    blockRes: BlockRes;
}

export function MenuItem({text, hotkeyPos, bX, blockRes}: MenuItemProps) {
    function elementMarkup() {
        let markup = "";

        for (let i = 0; i < text.length; i++) {
            if (i == hotkeyPos) {
                markup += '<span class="font-red top-menu-char-block" style="width: ' + blockRes.width + 'px; height: ' + blockRes.height + 'px">' + text[i] + '</span>';
            } else {
                markup += '<span class="top-menu-char-block" style="width: ' + blockRes.width + 'px; height: ' + blockRes.height + 'px">' + text[i] + '</span>';
            }
        }

        return {__html: markup};
    }

    // We need to adjust the display coordinates because for some reason the font shifts left and up.
    // Hacky but seems to work for now.
    return <div
        style={{
            position: "absolute",
            left: (bX * blockRes.width) + 1,
            top: 1
        }}
        dangerouslySetInnerHTML={elementMarkup()}
        >
    </div>;
}