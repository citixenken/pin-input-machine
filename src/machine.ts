import { createMachine } from "@zag-js/core";

// context
type MachineContext = {
  value: string[];
  focusedIndex: number;
};

// state
type MachineState = {
  value: "idle" | "focused";
};

export const machine = createMachine<MachineContext, MachineState>({
  id: "pin-input",
  context: { value: [], focusedIndex: -1 },
  initial: "idle",
  states: {
    idle: {
      on: {
        FOCUS: {
          target: "focused",
          actions: ["setFocusedIndex"],
        },
      },
    },
    focused: {
      on: {
        BLUR: {
          target: "idle",
          actions: ["clearFocusedIndex"],
        },
        INPUT: { actions: ["setFocusedValue", "focusNextInput"] },
        BACKSPACE: { actions: ["clearFocusedValue", "focusPrevInput"] },
        PASTE: { actions: ["setPastedValue", "focusLastEmptyInput"] },
      },
    },
  },
});
