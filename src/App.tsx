import './App.css'
import {TopBar} from "./components/TopBar/TopBar.tsx";
import {useEffect} from "react";
import {debugLog} from "./logger.ts";
import {Cursor} from "./components/Cursor/Cursor.tsx";
import {BottomBar} from "./components/BottomBar/BottomBar.tsx";
import Documents from "./components/Documents/Documents.tsx";
import {useAppDispatch, useAppSelector} from "./hooks.ts";
import {
  selectBlockSize,
  selectCols,
  selectDimensions,
  selectLeftOffset, selectRows,
  setBlockSize,
  setDimensions,
  setLeftOffset
} from "./appSlice.ts";

function App() {
  const drawGrid = false;
  const aspectRatio = 1.6;

  const dispatch = useAppDispatch();
  const blockSize = useAppSelector(selectBlockSize);
  const leftOffset = useAppSelector(selectLeftOffset);
  const dimensions = useAppSelector(selectDimensions);
  const cols = useAppSelector(selectCols);
  const rows = useAppSelector(selectRows);


  // Updates app bounds, position, etc.
  function handleResize() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;

    // Set App dimensions to as large as possible while maintaining aspect ratio
    let adjustedWidth = Math.floor(h * aspectRatio);
    let adjustedHeight = Math.floor(h);
    if (adjustedWidth > w) {
      adjustedWidth = Math.floor(w);
      adjustedHeight = Math.floor(w * (aspectRatio - 1));
    }

    const blockW = Math.floor(adjustedWidth / cols);
    const blockH = Math.floor(adjustedHeight / rows);

    // Now we need to reduce the size of App so it's an integer multiple of the blocks
    // to prevent excess workspace
    adjustedWidth = cols * blockW;
    adjustedHeight = rows * blockH;

    const leftOffset = (w / 2) - (adjustedWidth / 2);

    dispatch(setDimensions({ width: adjustedWidth, height: adjustedHeight }));
    dispatch(setBlockSize({ width: blockW, height: blockH }));
    dispatch(setLeftOffset(leftOffset));
    document.getElementById("App")!.style.backgroundSize = blockW + "px";
    document.getElementById("App")!.style.fontSize = blockH + "px";

    debugLog("Set new state to: \n" +
        "- w,h: " + adjustedWidth + "," + adjustedHeight + "\n" +
        "- block res: " + blockW + "," + blockH + "\n" +
        "- offset: " + leftOffset
    );
  }


  useEffect(() => {
    debugLog("useEffect called in App");

    // Unfortunately we need to rerender all components when the window size changes to redraw the UI
    handleResize();
    window.addEventListener("resize", handleResize);

    if (drawGrid) {
      for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 25; y++) {
          const elem = document.createElement("div");
          elem.style.position = "absolute";
          elem.style.left = leftOffset + (x * blockSize.width) + "px";
          elem.style.top = (y * blockSize.height) + "px";
          elem.style.width = blockSize.width + "px";
          elem.style.height = blockSize.height + "px";
          elem.style.boxSizing = "border-box";
          elem.style.border = "solid 1px red";
          document.body.appendChild(elem);
        }
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          left: leftOffset,
          overflow: "hidden"
        }}
        className="App"
        id="App"
    >
      <TopBar />
      <BottomBar cols={cols} rows={rows} />
      <Documents />
      <Cursor />
    </div>
  )
}

export default App;
