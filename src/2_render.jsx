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

function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.type)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

const Didact = {
  createElement,
  render,
};

/** ######################################### */
// const element = Didact.createElement(
//   "div",
//   { id: "foo" },
//   Didact.createElement("a", null, "bar"),
//   Didact.createElement("b", null, "aaa")
// );

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

console.log("🚀 ~ file: index.jsx:34 ~ element:", element);

// function render(element, container) {
//   const e =
//     element.type === "TEXT_ELEMENT"
//       ? document.createTextNode(element.type)
//       : document.createElement(element.type);

//   const isProperty = (key) => key !== "children";

//   Object.keys(element.props)
//     .filter(isProperty)
//     .forEach((key) => {
//       e[key] = element.props[key];
//     });

//   container.appendChild(e);

//   if (element.props.children) {
//     element.props.children.forEach((child) => {
//       render(child, e);
//     });
//   }
// }

const container = document.getElementById("root");
Didact.render(element, container);
