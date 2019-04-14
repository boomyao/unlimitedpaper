import React from "react";
import ReactDOM from "react-dom";
import { getChordTone, GuitarChord } from "./chord";
import "./styles.css";

// 示例
// let chord = new GuitarChord();
// let result = chord.chord("C");
// console.log(result);
console.log(getChordTone("C"));

const width = 846;
const lineSpacing = 10;
const paddings = [30, 50];
const staffWidth = width - paddings[1] * 2;
const staffHeight = lineSpacing * 5;
const measureWidth = 165;
const headWidth = staffWidth - measureWidth * 4;

function App() {
  const startX = paddings[1];
  const startY = paddings[0];
  return (
    <div className="App">
      <svg width={width} height="1000">
        <g stroke="#000" strokeWidth={2}>
          <line
            x1={startX + 1}
            y1={startY - 1}
            x2={startX + 1}
            y2={startY + staffHeight * 3 + 1}
          />
          <line
            x1={startX + headWidth + 1}
            y1={startY - 1}
            x2={startX + headWidth + 1}
            y2={startY + staffHeight + 1}
          />
          {[1, 2, 3, 4].map(p => (
            <line
              x1={startX + headWidth + p * measureWidth + 1}
              y1={startY - 1}
              x2={startX + headWidth + p * measureWidth + 1}
              y2={startY + staffHeight + 1}
            />
          ))}
          {[1, 2, 3, 4, 5, 6].map((l, i) => (
            <line
              x1={startX}
              y1={startY + i * lineSpacing}
              x2={startX + staffWidth}
              y2={startY + i * lineSpacing}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
