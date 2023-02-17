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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          console.log(formData.get("pincode"));
        }}
      >
        <div data-part="container">
          <label
            onClick={() => {
              send({ type: "LABEL_CLICK" });
            }}
          >
            Enter Verification
          </label>
          <input name="pincode" type="hidden" value={value.join("")} />
          <div data-part="input-group">
            {inputs.map((idx) => (
              <input
                data-part="input"
                key={idx}
                maxLength={2} // buggy if you type fast enough
                // maxLength={1}
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
                  e.preventDefault();
                  const value = e.clipboardData.getData("Text").trim();
                  send({ type: "PASTE", value, idx });
                }}
              />
            ))}
          </div>
        </div>
        <button type="submit">Send</button>
      </form>
      {/* <pre>{JSON.stringify(state)}</pre> */}
    </div>
  );
}

export default App;
