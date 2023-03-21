function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const Didact = {
  createElement,
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

console.log("🚀 ~ file: index.jsx:34 ~ element:", element);

function render(element, container) {
  const e =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.type)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((key) => {
      e[key] = element.props[key];
    });

  container.appendChild(e);

  if (element.props.children) {
    element.props.children.forEach((child) => {
      render(child, e);
    });
  }
}

const container = document.getElementById("root");
render(element, container);
