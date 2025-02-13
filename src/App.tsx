import './App.css'
import {TopMenu} from "./components/TopMenu/TopMenu.tsx";
import {useEffect, useState} from "react";
import {debugLog} from "./components/helpers/logger.ts";
import {Cursor} from "./components/Cursor/Cursor.tsx";

function App() {
  const debug = true;
  const drawGrid = false;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0});
  const [blockRes, setBlockRes] = useState({ width: 0, height: 0});
  const [offset, setOffset] = useState(0);

  const cols = 80;
  const rows = 25;
  const aspectRatio = 1.6;

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

    setDimensions({ width: adjustedWidth, height: adjustedHeight });
    setBlockRes({ width: blockW, height: blockH });
    setOffset(leftOffset);
    document.getElementById("App")!.style.backgroundSize = String(blockW / 8) + "%";

    debugLog(debug, "Set new state to: \n" +
        "- w,h: " + adjustedWidth + "," + adjustedHeight + "\n" +
        "- block res: " + blockW + "," + blockH + "\n" +
        "- offset: " + leftOffset
    );

    return {
      dw: w,
      dh: h,
      bw: blockW,
      bh: blockH,
      offset: leftOffset
    };
  }

  // Unfortunately we need to rerender all components when the window size changes to redraw the UI
  useEffect(() => {
    const vars = handleResize();
    window.addEventListener("resize", handleResize);

    if (drawGrid) {
      for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 25; y++) {
          const elem = document.createElement("div");
          elem.style.position = "absolute";
          elem.style.left = (x * vars.bw) + "px";
          elem.style.top = (y * vars.bh) + "px";
          elem.style.width = vars.bw + "px";
          elem.style.height = vars.bh + "px";
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
          left: offset
        }}
        className="App"
        id="App"
    >
      <TopMenu
          blockRes={blockRes}
      />
      <Cursor
          dimensions={dimensions}
          blockRes={blockRes}
          offset={offset}
          cols={cols}
          rows={rows}
      />
    </div>
  )
}

export default App
