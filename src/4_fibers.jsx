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

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

// Concurrent Mode
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  console.log("🚀 ~ file: index.jsx:65 ~ performUnitOfWork ~ fiber:", fiber);
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  // create children's fiber
  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // return  next unit
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
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
const fiber = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

console.log("🚀 ~ file: index.jsx:34 ~ element:", wipFiber);

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
Didact.render(wipFiber, container);
