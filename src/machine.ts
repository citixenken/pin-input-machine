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

export const machine = createMachine<MachineContext, MachineState>(
  {
    id: "pin-input",
    context: {
      value: Array.from<string>({ length: 4 }).fill(""),
      focusedIndex: -1,
    },
    watch: {
      focusedIndex: ["executeFocus"],
    },
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
  },
  {
    actions: {
      setFocusedIndex(context, e) {
        context.focusedIndex = e.idx;
      },
      clearFocusedIndex(context) {
        context.focusedIndex = -1;
      },
      setFocusedValue(context, e) {
        context.value[context.focusedIndex] = e.value;
      },
      focusNextInput(context, e) {
        const nextIndex = Math.min(
          context.focusedIndex + 1,
          context.value.length - 1
        );
        context.focusedIndex = nextIndex;
      },
      executeFocus(context) {
        const inputGroup = document.querySelector("[data-part=input-group]");
        if (!inputGroup || context.focusedIndex === -1) return;

        const inputElements = Array.from(
          document.querySelectorAll<HTMLInputElement>("[data-part=input]")
        );

        const input = inputElements[context.focusedIndex];
        requestAnimationFrame(() => {
          input?.focus();
        });
      },
      clearFocusedValue(context) {
        context.value[context.focusedIndex] = "";
      },
      focusPrevInput(context) {
        const prevIndex = Math.max(0, context.focusedIndex - 1);
        context.focusedIndex = prevIndex;
      },
      setPastedValue() {},
      focusLastEmptyInput() {},
    },
  }
);
