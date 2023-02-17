import { useMachine } from "@zag-js/react";
import "./App.css";
import { machine } from "./machine";

const inputs = [...Array.from({ length: 4 }).keys()];

function App() {
  const [state, send] = useMachine(machine);
  const { value, focusedIndex } = state.context;
  const { type } = state.event;

  return (
    <div className="App">
      <pre>{JSON.stringify({ value, focusedIndex, type })}</pre>
      <div data-part="container">
        <label>Enter Verification</label>
        <div data-part="input-group">
          {inputs.map((idx) => (
            <input
              data-part="input"
              key={idx}
              value={value[idx]}
              onChange={(e) => {
                const { value } = e.target;
                send({ type: "INPUT", idx, value });
              }}
              onFocus={() => send({ type: "FOCUS", idx })}
              onBlur={() => send({ type: "BLUR" })}
              onKeyDown={(e) => {
                const { key } = e;
                if (key === "Backspace") {
                  send({ type: "BACKSPACE", idx });
                }
              }}
              onPaste={(e) => {
                const value = e.clipboardData.getData("Text");
                send({ type: "PASTE", value, idx });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
