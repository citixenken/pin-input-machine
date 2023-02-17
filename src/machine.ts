import { createMachine } from "@zag-js/core";

// context
type MachineContext = {
  value: string[];
  focusedIndex: number;
  readonly isCompleted: boolean;
  onComplete?: (value: string[]) => void;
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
      onComplete(value) {
        console.log({ value });
      },
    },
    computed: {
      isCompleted(context) {
        return context.value.every((value) => value !== "");
      },
    },
    watch: {
      focusedIndex: ["executeFocus"],
      isCompleted: ["invokeOnComplete"],
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
        const eventValue: string = e.value;
        const focusedValue = context.value[context.focusedIndex];
        const nextValue = getNextValue(focusedValue, eventValue);
        context.value[context.focusedIndex] = nextValue;
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
      setPastedValue(context, e) {
        const pastedValue: string[] = e.value
          .split("")
          .slice(0, context.value.length);
        pastedValue.forEach((value, idx) => {
          context.value[idx] = value;
        });
      },
      focusLastEmptyInput(context) {
        const idx = context.value.findIndex((value) => value === "");
        const lastIdx = context.value.length - 1;
        context.focusedIndex = idx === -1 ? lastIdx : idx;
      },
      invokeOnComplete(context) {
        if (!context.isCompleted) return;
        context.onComplete?.(Array.from(context.value));
      },
    },
  }
);

const getNextValue = (focusedValue: string, eventValue: string) => {
  let nextValue = eventValue;

  if (focusedValue[0] === eventValue[0]) {
    nextValue = eventValue[1];
  } else if (focusedValue[0] === eventValue[1]) {
    nextValue = eventValue[0];
  }
  return nextValue;
};
