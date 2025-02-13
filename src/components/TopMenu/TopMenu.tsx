import {BlockRes} from "../../types.ts";
import "./TopMenu.css"
import {MenuItem} from "./MenuItem/MenuItem.tsx";

interface TopMenuProps {
    blockRes: BlockRes;
}

export function TopMenu({ blockRes }: TopMenuProps) {
    return (
        <div
            className="bg-grey TopMenuContainer"
            style={{
                fontSize: blockRes.height * 0.9
            }}
        >
            <MenuItem text="≡" hotkeyPos={0} bX={2} blockRes={blockRes} />
            <div style={{
                width: "100%",
                height: blockRes.height
            }}
            className="TopMenu">
                <MenuItem text="File" hotkeyPos={0} bX={5} blockRes={blockRes} />
                <MenuItem text="Edit" hotkeyPos={0} bX={11} blockRes={blockRes} />
                <MenuItem text="Search" hotkeyPos={0} bX={17} blockRes={blockRes} />
                <MenuItem text="Run" hotkeyPos={0} bX={25} blockRes={blockRes} />
                <MenuItem text="Compile" hotkeyPos={0} bX={30} blockRes={blockRes} />
                <MenuItem text="Debug" hotkeyPos={0} bX={39} blockRes={blockRes} />
                <MenuItem text="Project" hotkeyPos={0} bX={46} blockRes={blockRes} />
                <MenuItem text="Options" hotkeyPos={0} bX={55} blockRes={blockRes} />
                <MenuItem text="Window" hotkeyPos={0} bX={66} blockRes={blockRes} />
                <MenuItem text="Help" hotkeyPos={0} bX={74} blockRes={blockRes} />
            </div>
        </div>
    );
}