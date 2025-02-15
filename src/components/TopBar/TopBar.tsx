import "./TopBar.css"
import {Menu} from "../Menu/Menu.tsx";
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import SubMenu from "../Menu/SubMenu/SubMenu.tsx";
import {useEffect, useState} from "react";


export function TopBar() {
    const blockSize = useAppSelector(selectBlockSize);
    const [activeMenu, setActiveMenu] = useState(-1);

    function toggleMenu(id: number) {
        if (activeMenu == id) {
            setActiveMenu(-1);
        } else {
            setActiveMenu(id);
        }
    }

    function keyHandler(event: KeyboardEvent) {
        if (activeMenu >= 0 && event.code == "Escape") {
            setActiveMenu(-1);
        } else if (event.code == "Space" && event.altKey) {
            setActiveMenu(0);
        } else if (event.code == "KeyF" && event.altKey) {
            setActiveMenu(1);
        } else if (event.code == "KeyE" && event.altKey) {
            setActiveMenu(2);
        } else if (event.code == "KeyS" && event.altKey) {
            setActiveMenu(3);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', keyHandler);

        return () => {
            window.removeEventListener('keydown', keyHandler);
        };
    }, [activeMenu]);

    return (
        <div className="bg-grey TopBarContainer">
            <Menu text=" ≡ " hotkeyPos={[1]} bX={1} open={activeMenu == 0} onClick={() => toggleMenu(0)}>
                <SubMenu
                    left={0}
                    top={1}
                    width={21}
                    height={8}
                    entries={[
                        { text: "Repaint desktop", hotkeyPos: 0 },
                        "separator",
                        { text: "GREP           ", hotkeyPos: 0 },
                        { text: "Turbo Assembler", hotkeyPos: 0 },
                        { text: "Turbo Debugger ", hotkeyPos: 6 },
                        { text: "Turbo Profiler ", hotkeyPos: 6 },
                    ]}
                />
            </Menu>
            <div style={{
                width: "100%",
                height: blockSize.height
            }}>
                <Menu text=" File " hotkeyPos={[1]} bX={4} open={activeMenu == 1} onClick={() => toggleMenu(1)}>
                    <SubMenu
                        left={3}
                        top={1}
                        width={22}
                        height={13}
                        entries={[
                            { text: "New             ", hotkeyPos: 0 },
                            { text: "Open...       F3", hotkeyPos: 0 },
                            { text: "Save          F2", hotkeyPos: 0 },
                            { text: "Save as...      ", hotkeyPos: 1 },
                            { text: "Save all        ", hotkeyPos: 6 },
                            "separator",
                            { text: "Change dir...   ", hotkeyPos: 0},
                            { text: "Print           ", hotkeyPos: 0 },
                            { text: "DOS shell       ", hotkeyPos: 0 },
                            "separator",
                            { text: "Quit            ", hotkeyPos: 0 },
                        ]}
                    />
                </Menu>
                <Menu text=" Edit " hotkeyPos={[1]} bX={10} open={activeMenu == 2} onClick={() => toggleMenu(2)}>
                    <SubMenu
                        left={9}
                        top={1}
                        width={30}
                        height={12}
                        entries={[
                            { text: "Undo            Alt+BkSp", hotkeyPos: 0 },
                            { text: "Redo      Shift+Alt+BkSp", hotkeyPos: 0 },
                            "separator",
                            { text: "Cut            Shift+Del", hotkeyPos: 0 },
                            { text: "Copy            Ctrl+Ins", hotkeyPos: 0 },
                            { text: "Paste          Shift+Ins", hotkeyPos: 0 },
                            { text: "Clear           Ctrl+Del", hotkeyPos: 0},
                            { text: "Copy example            ", hotkeyPos: 0 },
                            "separator",
                            { text: "Show clipboard          ", hotkeyPos: 0 },
                        ]}
                    />
                </Menu>
                <Menu text=" Search " hotkeyPos={[1]} bX={16} open={activeMenu == 3} onClick={() => toggleMenu(3)}>
                    <SubMenu
                        left={15}
                        top={1}
                        width={31}
                        height={10}
                        entries={[
                            { text: "Find...                  ", hotkeyPos: 0 },
                            { text: "Replace...               ", hotkeyPos: 0 },
                            { text: "Search again       Ctrl+L", hotkeyPos: 0 },
                            "separator",
                            { text: "Go to line number...     ", hotkeyPos: 0 },
                            { text: "Previous error     Alt+F7", hotkeyPos: 0 },
                            { text: "Next error         Alt+F8", hotkeyPos: 0},
                            { text: "Locate function...       ", hotkeyPos: 0 },
                        ]}
                    />
                </Menu>
                <Menu text=" Run " hotkeyPos={[1]} bX={24} open={activeMenu == 4} onClick={() => toggleMenu(4)} />
                <Menu text=" Compile " hotkeyPos={[1]} bX={29} open={activeMenu == 5} onClick={() => toggleMenu(5)} />
                <Menu text=" Debug " hotkeyPos={[1]} bX={38} open={activeMenu == 6} onClick={() => toggleMenu(6)} />
                <Menu text=" Project " hotkeyPos={[1]} bX={45} open={activeMenu == 7} onClick={() => toggleMenu(7)} />
                <Menu text=" Options " hotkeyPos={[1]} bX={54} open={activeMenu == 8} onClick={() => toggleMenu(8)} />
                <Menu text=" Window " hotkeyPos={[1]} bX={65} open={activeMenu == 9} onClick={() => toggleMenu(9)} />
                <Menu text=" Help  " hotkeyPos={[1]} bX={73} open={activeMenu == 10} onClick={() => toggleMenu(10)} />
            </div>
        </div>
    );
}