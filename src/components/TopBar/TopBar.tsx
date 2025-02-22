import "./TopBar.css"
import {Menu} from "../Menu/Menu.tsx";
import {useAppSelector} from "../../hooks.ts";
import {selectBlockSize} from "../../appSlice.ts";
import SubMenu from "../Menu/SubMenu/SubMenu.tsx";
import {useEffect} from "react";
import * as React from "react";
import {debugLog} from "../../logger.ts";
import {selectActiveMenu, setActiveMenu} from "./topBarSlice.ts";
import {newDocument} from "../Documents/documentsSlice.ts";
import {useDispatch} from "react-redux";
import { tasmOpen, tdOpen, tpOpen } from "./menuHandlers/spaceMenu.ts";


export function TopBar() {
    const blockSize = useAppSelector(selectBlockSize);
    const activeMenu = useAppSelector(selectActiveMenu);
    const dispatch = useDispatch();
    const [displayElements, setDisplayElements] = React.useState<Map<string, React.ReactElement>>(new Map());


    function addMapEntry(key: string, value: React.ReactElement) {
        setDisplayElements(prevState => {
            return new Map(prevState).set(key, value);
        });
    }
    
    
    function removeMapEntry(key: string) {
        setDisplayElements(prevState => {
            const newState = new Map(prevState);
            newState.delete(key);
            return newState;
        });
    }


    function toggleMenu(id: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log("Clicked main menu index " + id);

        // Prevent click from propagating to App
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        if (activeMenu == id) {
            dispatch(setActiveMenu(-1));
        } else {
            dispatch(setActiveMenu(id));
        }
    }


    function keyHandler(event: KeyboardEvent) {
        if (activeMenu >= 0 && event.code == "Escape") {
            dispatch(setActiveMenu(-1));
        } else if (event.code == "Space" && event.altKey) {
            dispatch(setActiveMenu(0));
        } else if (event.code == "KeyF" && event.altKey) {
            dispatch(setActiveMenu(1));
        } else if (event.code == "KeyE" && event.altKey) {
            dispatch(setActiveMenu(2));
        } else if (event.code == "KeyS" && event.altKey) {
            dispatch(setActiveMenu(3));
        }
    }


    useEffect(() => {
        debugLog("useEffect called in TopBar");

        document.addEventListener('keydown', keyHandler);

        return () => {
            window.removeEventListener('keydown', keyHandler);
        };
    }, []);


    return (
        <>
            <div className="bg-grey TopBarContainer">
                <Menu text=" ≡ " hotkeyPos={[1]} bX={1} open={activeMenu == 0} onClick={(event) => toggleMenu(0, event)}>
                    <SubMenu
                        left={0}
                        top={1}
                        width={21}
                        height={8}
                        entries={[
                            { text: "Repaint desktop", hotkeyPos: 0 },
                            "separator",
                            { text: "GREP           ", hotkeyPos: 0 },
                            { text: "Turbo Assembler", hotkeyPos: 0, action: () => tasmOpen(addMapEntry, removeMapEntry) },
                            { text: "Turbo Debugger ", hotkeyPos: 6, action: () => tdOpen(addMapEntry, removeMapEntry) },
                            { text: "Turbo Profiler ", hotkeyPos: 6, action: () => tpOpen(addMapEntry, removeMapEntry) },
                        ]}
                    />
                </Menu>
                <div style={{
                    width: "100%",
                    height: blockSize.height
                }}>
                    <Menu text=" File " hotkeyPos={[1]} bX={4} open={activeMenu == 1} onClick={(event) => toggleMenu(1, event)}>
                        <SubMenu
                            left={3}
                            top={1}
                            width={22}
                            height={13}
                            entries={[
                                { text: "New             ", hotkeyPos: 0, action: () => dispatch(newDocument()) },
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
                    <Menu text=" Edit " hotkeyPos={[1]} bX={10} open={activeMenu == 2} onClick={(event) => toggleMenu(2, event)}>
                        <SubMenu
                            left={9}
                            top={1}
                            width={30}
                            height={12}
                            entries={[
                                { text: "Undo            Alt+BkSp", hotkeyPos: 0 },
                                { text: "Redo      Shift+Alt+BkSp", hotkeyPos: 0, disabled: true },
                                "separator",
                                { text: "Cut            Shift+Del", hotkeyPos: 0, disabled: true },
                                { text: "Copy            Ctrl+Ins", hotkeyPos: 0, disabled: true },
                                { text: "Paste          Shift+Ins", hotkeyPos: 0, disabled: true },
                                { text: "Clear           Ctrl+Del", hotkeyPos: 0, disabled: true },
                                { text: "Copy example            ", hotkeyPos: 0, disabled: true },
                                "separator",
                                { text: "Show clipboard          ", hotkeyPos: 0 },
                            ]}
                        />
                    </Menu>
                    <Menu text=" Search " hotkeyPos={[1]} bX={16} open={activeMenu == 3} onClick={(event) => toggleMenu(3, event)}>
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
                    <Menu text=" Run " hotkeyPos={[1]} bX={24} open={activeMenu == 4} onClick={(event) => toggleMenu(4, event)}>
                        <SubMenu
                            left={23}
                            top={1}
                            width={29}
                            height={8}
                            entries={[
                                { text: "Run             Ctrl+F9", hotkeyPos: 0 },
                                { text: "Program reset   Ctrl+F2", hotkeyPos: 0 },
                                { text: "Go to cursor         F4", hotkeyPos: 0 },
                                { text: "Trace into           F7", hotkeyPos: 0 },
                                { text: "Step over            F8", hotkeyPos: 0 },
                                { text: "Arguments...           ", hotkeyPos: 0},
                            ]}
                        />
                    </Menu>
                    <Menu text=" Compile " hotkeyPos={[1]} bX={29} open={activeMenu == 5} onClick={(event) => toggleMenu(5, event)}>
                        <SubMenu
                            left={28}
                            top={1}
                            width={28}
                            height={9}
                            entries={[
                                { text: "Compile         Alt+F9", hotkeyPos: 0 },
                                { text: "Make                F9", hotkeyPos: 0 },
                                { text: "Link                  ", hotkeyPos: 0 },
                                { text: "Build all             ", hotkeyPos: 0 },
                                "separator",
                                { text: "Information...        ", hotkeyPos: 0 },
                                { text: "Remove messages       ", hotkeyPos: 0},
                            ]}
                        />
                    </Menu>
                    <Menu text=" Debug " hotkeyPos={[1]} bX={38} open={activeMenu == 6} onClick={(event) => toggleMenu(6, event)}>
                        <SubMenu
                            left={37}
                            top={1}
                            width={35}
                            height={8}
                            entries={[
                                { text: "Inspect...             Alt+F4", hotkeyPos: 0 },
                                { text: "Evaluate/modify...    Ctrl+F4", hotkeyPos: 0 },
                                { text: "Call stack...         Ctrl+F3", hotkeyPos: 0 },
                                { text: "Watches                     ", hotkeyPos: 0 },
                                { text: "Toggle breakpoint     Ctrl+F8", hotkeyPos: 0 },
                                { text: "Breakpoints...               ", hotkeyPos: 0},
                            ]}
                        />
                    </Menu>
                    <Menu text=" Project " hotkeyPos={[1]} bX={45} open={activeMenu == 7} onClick={(event) => toggleMenu(7, event)}>
                        <SubMenu
                            left={44}
                            top={1}
                            width={22}
                            height={9}
                            entries={[
                                { text: "Open project... ", hotkeyPos: 0 },
                                { text: "Close project   ", hotkeyPos: 0 },
                                "separator",
                                { text: "Add item...     ", hotkeyPos: 0 },
                                { text: "Delete item     ", hotkeyPos: 0 },
                                { text: "Local options...", hotkeyPos: 0 },
                                { text: "Include files...", hotkeyPos: 0},
                            ]}
                        />
                    </Menu>
                    <Menu text=" Options " hotkeyPos={[1]} bX={54} open={activeMenu == 8} onClick={(event) => toggleMenu(8, event)}>
                        <SubMenu
                            left={53}
                            top={1}
                            width={25}
                            height={14}
                            entries={[
                                { text: "Application...     ", hotkeyPos: 0 },
                                { text: "Compiler          ", hotkeyPos: 0 },
                                { text: "Transfer...        ", hotkeyPos: 0 },
                                { text: "Make...            ", hotkeyPos: 0 },
                                { text: "Linker            ", hotkeyPos: 0 },
                                { text: "Librarian...       ", hotkeyPos: 1},
                                { text: "Debugger...        ", hotkeyPos: 2},
                                { text: "Directories...     ", hotkeyPos: 0},
                                "separator",
                                { text: "Environment       ", hotkeyPos: 0},
                                "separator",
                                { text: "Save...            ", hotkeyPos: 0},
                            ]}
                        />
                    </Menu>
                    <Menu text=" Window " hotkeyPos={[1]} bX={65} open={activeMenu == 9} onClick={(event) => toggleMenu(9, event)} />
                    <Menu text=" Help  " hotkeyPos={[1]} bX={73} open={activeMenu == 10} onClick={(event) => toggleMenu(10, event)} />
                </div>
            </div>
            {Array(...displayElements.values())}
        </>
    );
}