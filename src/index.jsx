import { createElement, render, useState } from "./libs/didact";

/** @jsx createElement */
function Counter() {
  const [state, setState] = useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

const element = <Counter />;

console.log("🚀 ~ file: index.jsx:34 ~ element:", element);

const container = document.getElementById("root");
render(element, container);
