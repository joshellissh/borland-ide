import "./BottomBar.css"
import {Menu} from "../Menu/Menu.tsx";
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";

interface BottomMenuProps {
    cols: number;
    rows: number;
}

export function BottomBar({cols, rows}: BottomMenuProps) {
    const blockSize = useAppSelector(selectBlockSize);

    return <div
        className="bg-grey BottomBar"
        style={{
            top: ((rows - 1) * blockSize.height),
            width: blockSize.width * cols,
            height: blockSize.height
        }}
    >
        <Menu text="F1 Help" hotkeyPos={[0,1]} bX={1} open={false} onClick={()=>{}} />
        <Menu text="F2 Save" hotkeyPos={[0,1]} bX={11} open={false} onClick={()=>{}} />
        <Menu text="F3 Open" hotkeyPos={[0,1]} bX={21} open={false} onClick={()=>{}} />
        <Menu text="Alt-F9 Compile" hotkeyPos={[0,1,2,3,4,5]} bX={31} open={false} onClick={()=>{}} />
        <Menu text="F9 Make" hotkeyPos={[0,1]} bX={48} open={false} onClick={()=>{}} />
        <Menu text="F10 Menu" hotkeyPos={[0,1,2]} bX={58} open={false} onClick={()=>{}} />
    </div>
}