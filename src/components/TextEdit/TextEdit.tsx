import { CSSProperties, useState } from "react";
import { selectBlockSize } from "../../appSlice";
import { useAppSelector } from "../../hooks";
import { Text } from "../Text/Text";
import "./TextEdit.css"
import { Caret } from "../Caret/Caret";
import { debugLog } from "../../logger";


export interface TextEditProps {
    id: number;
    width: number;
    height?: number;
    caretCallback: Function;
    style?: CSSProperties;
}


export function TextEdit({id, width, height, caretCallback, style}: TextEditProps) {
    const blockSize = useAppSelector(selectBlockSize);
    const [lines, setLines] = useState(["Test", "Text"]);
    const [caretPos, setCaretPos] = useState({x: 0, y: 0});


    function isPrintable(keycode: number) {
        return (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)
    }

    
    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        const newPos = { x: caretPos.x, y: caretPos.y };

        debugLog(event.code);

        switch (event.code) {
            case "ArrowLeft":
                if (caretPos.x > 0) { newPos.x--; }
                break;
            case "ArrowRight":
                if (caretPos.x < 1023) { newPos.x++; }
                break;
            case "ArrowUp":
                if (caretPos.y > 0) { newPos.y--; }
                break;
            case "ArrowDown":
                {
                    if (caretPos.y < 1023) { newPos.y++; }

                    // Prevent Y cursor from going below our number of lines
                    if (newPos.y > lines.length - 1) { newPos.y = lines.length - 1; }
                }
                break;
            case "Home":
                newPos.x = 0;
                break;
            case "End":
                newPos.x = lines[caretPos.y].length; 
                break;
            case "Backspace":
                {
                    const newLines = [...lines];

                    if (caretPos.x == 0 && caretPos.y == 0) {
                        console.log("NOP");
                        return;
                    } 
                    // Bring line back to previous line and append
                    else if (caretPos.x == 0 && caretPos.y > 0) {
                        newPos.x = newLines[caretPos.y - 1].length;
                        newPos.y--;

                        newLines[caretPos.y - 1] += newLines[caretPos.y];

                        // Shift lines up by one
                        for (let i = caretPos.y; i < newLines.length; i++) {
                            newLines[i] = newLines[i+1];
                        }

                        // Remove end line
                        newLines.pop();
                    } 
                    // Remove character
                    else {
                        newLines[caretPos.y] = newLines[caretPos.y].substring(0, caretPos.x - 1) + newLines[caretPos.y].substring(caretPos.x);
                        newPos.x--;
                    }

                    setLines(newLines);
                }
                break;
            case "Delete": 
                {
                    const newLines = [...lines];

                    // EOD, nothing to do
                    if (caretPos.x == newLines[caretPos.y].length && caretPos.y == newLines.length - 1) {
                        debugLog("EOD");
                        return;
                    }
                    // EOL. Move everything up.
                    else if (caretPos.x == newLines[caretPos.y].length && caretPos.y < newLines.length - 1) {
                        debugLog("EOL");

                        newLines[caretPos.y] += newLines[caretPos.y + 1];

                        // Shift lines up by one
                        for (let i = caretPos.y + 1; i < newLines.length; i++) {
                            newLines[i] = newLines[i+1];
                        }

                        // Remove end line
                        newLines.pop();
                    }
                    // Just delete character
                    else {
                        debugLog("Delete character");

                        newLines[caretPos.y] = newLines[caretPos.y].substring(0, caretPos.x) + newLines[caretPos.y].substring(caretPos.x + 1);
                    }

                    setLines(newLines);
                }
                break;
            case "Enter":
            case "NumpadEnter":
                {
                    const newLines = [...lines];

                    // Nothing past here, just create and move to next line
                    if (newLines.length == caretPos.y + 1 && caretPos.x == newLines[caretPos.y].length) {
                        debugLog("EOL and end of lines");
                        newLines.push("");
                        newPos.y++;
                        newPos.x = 0;
                    } 
                    // Splitting in the middle of line, or inserting blank line in the middle of existing lines
                    else {              
                        // Add new line at end
                        newLines.push("");

                        // Empty line, just push down and move to next
                        if (caretPos.x == 0 && lines[caretPos.y].length == 0) {
                            console.log("Empty");

                            // Shift lines down by one
                            for (let i = newLines.length - 1; i > caretPos.y; i--) {
                                newLines[i] = newLines[i-1];
                            }
                        }
                        // Split line
                        else if (caretPos.x < lines[caretPos.y].length) {
                            console.log("Split");

                            const oldLine = lines[caretPos.y].substring(0, caretPos.x);
                            const newLine = lines[caretPos.y].substring(caretPos.x);

                            // Shift lines down by one
                            for (let i = newLines.length - 1; i > caretPos.y + 1; i--) {
                                newLines[i] = newLines[i-1];
                            }

                            newLines[caretPos.y] = oldLine;
                            newLines[caretPos.y + 1] = newLine;
                        } 
                        // Just move to next line
                        else {
                            console.log("EOL");
                           
                            // Shift lines down by one
                            for (let i = newLines.length - 1; i > caretPos.y; i--) {
                                newLines[i] = newLines[i-1];
                            }

                            // Blank out newly inserted line
                            newLines[caretPos.y + 1] = "";
                        }
                        

                        newPos.y++;
                        newPos.x = 0;
                    }

                    setLines(newLines);
                }
                break;
            case "Tab":
                {
                    const newLines = [...lines];

                    // Insert *8* spaces. Wacky.
                    newLines[caretPos.y] = newLines[caretPos.y].slice(0, caretPos.x) + '        ' + newLines[caretPos.y].slice(caretPos.x);
                    newPos.x += 8;

                    setLines(newLines);

                    // Prevent tab from propagating
                    event.preventDefault();
                }
                break;
            default:
                {
                    // Bail if a control character
                    if (!isPrintable(event.keyCode)) {
                        return;
                    }

                    const newLines = [...lines];

                    // Append to end of line
                    if (caretPos.x == newLines[caretPos.y].length) {
                        debugLog("Append");
                    } 
                    // Caret is past EOL. Append spaces to fill.
                    else if (caretPos.x > newLines[caretPos.y].length) {
                        for (let i = newLines[caretPos.y].length; i < caretPos.x; i++) {
                            newLines[caretPos.y] += " ";
                        }
                    }
                    
                    newLines[caretPos.y] = newLines[caretPos.y].slice(0, caretPos.x) + event.key + newLines[caretPos.y].slice(caretPos.x);
                    setLines(newLines);
                    newPos.x++;
                }
                break;
        }

        // Set new caret positions
        setCaretPos(newPos);
        caretCallback({
            x: newPos.x + 1,
            y: newPos.y + 1
        });
    }


    function drawContents(): string {
        let str = "";

        lines.forEach(line => {
            str += line + "\n";
        })

        // Remove trailing newline
        str = str.slice(0, -1);

        return str;
    }
    

    return (<div
        className="TextEdit"
        id={"TextEdit" + id}
        onKeyDown={(event) => handleKeyDown(event)}
        tabIndex={0}
        style={style}
    >
        <Text bX={0} bY={0} passthru={true} position="relative">{drawContents()}</Text> 
        <Caret pos={caretPos} />
    </div>);
}