import { Tree } from "./index.js";
import { BST_SOURCE } from "./annotated-source.js";
import faviconSvg from "./favicon.svg";
import favicon32 from "./favicon-32.png";
import favicon180 from "./favicon-180.png";

// Imported (rather than referenced from index.html) so each file gets a
// content-hashed URL: browsers cache favicons very aggressively by URL, so
// a hash change is what actually gets an updated icon to show up.
function addIcon(rel, href, attrs = {}) {
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  Object.assign(link, attrs);
  document.head.appendChild(link);
}

addIcon("icon", faviconSvg, { type: "image/svg+xml" });
addIcon("icon", favicon32, { type: "image/png", sizes: "32x32" });
addIcon("apple-touch-icon", favicon180, { sizes: "180x180" });

const STORAGE_KEY = "binary-search-tree-state";
const DEFAULT_VALUES = [8, 3, 10, 1, 6, 14, 4, 7, 13];

let tree = new Tree(DEFAULT_VALUES);

const treeView = document.getElementById("tree-view");
const log = document.getElementById("log");

// ── Tree diagram: an in-order pass gives each node an x slot (so left
// always stays left of right), and depth gives it a y row. Rendered as
// plain SVG so the connecting branches are just <line> elements between
// two node centers. ──
const NODE_R = 16;
const X_STEP = 46;
const Y_STEP = 64;
const PAD = 30;

function layout(root) {
  const nodes = [];
  let x = 0;

  // In-order pass: a node's x slot is only decided once its whole left
  // subtree has claimed its slots, which is exactly what keeps left
  // children left of right children.
  function place(node, depth) {
    if (node === null) return;
    place(node.left, depth + 1);
    node.pos = {
      data: node.data,
      x: x * X_STEP + PAD,
      y: depth * Y_STEP + PAD,
    };
    nodes.push(node.pos);
    x += 1;
    place(node.right, depth + 1);
  }
  place(root, 0);

  // Second pass, now that every node has a .pos: walk the tree again to
  // pair each node's position with its children's.
  const edges = [];
  function collectEdges(node) {
    if (node === null) return;
    if (node.left) edges.push({ from: node.pos, to: node.left.pos });
    if (node.right) edges.push({ from: node.pos, to: node.right.pos });
    collectEdges(node.left);
    collectEdges(node.right);
  }
  collectEdges(root);

  return { nodes, edges };
}

function renderTree() {
  if (tree.root === null) {
    treeView.replaceChildren();
    const empty = document.createElement("span");
    empty.className = "tree-empty";
    empty.textContent = "null";
    treeView.appendChild(empty);
    return;
  }

  const { nodes, edges } = layout(tree.root);
  const width = nodes.length * X_STEP + PAD;
  const height = Math.max(...nodes.map((n) => n.y)) + PAD + NODE_R;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  edges.forEach(({ from, to }) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("class", "tree-edge");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    svg.appendChild(line);
  });

  nodes.forEach((n) => {
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute(
      "class",
      n.data === tree.root.data ? "tree-node root" : "tree-node",
    );
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", n.x);
    circle.setAttribute("cy", n.y);
    circle.setAttribute("r", NODE_R);
    g.appendChild(circle);
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", n.x);
    text.setAttribute("y", n.y);
    text.textContent = n.data;
    g.appendChild(text);
    svg.appendChild(g);
  });

  treeView.replaceChildren(svg);
}

function saveState() {
  const values = [];
  tree.inOrderForEach((v) => values.push(v));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const values = JSON.parse(raw);
    if (Array.isArray(values) && values.length) tree = new Tree(values);
  } catch {
    // ignore corrupt storage
  }
}

const typingTimers = new WeakMap();

function typeWriter(el, text, { speed = 22, onTick } = {}) {
  clearInterval(typingTimers.get(el));

  const textSpan = document.createElement("span");
  el.replaceChildren(textSpan);

  let i = 0;
  const timer = setInterval(() => {
    textSpan.textContent += text[i];
    i += 1;
    onTick?.();
    if (i >= text.length) clearInterval(timer);
  }, speed);
  typingTimers.set(el, timer);
}

const MAX_LOG_LINES = 20;

// Newest command goes on the left; the row scrolls horizontally and older
// entries drop off the right once MAX_LOG_LINES is exceeded.
function logLine(text, type = "ok") {
  const line = document.createElement("div");
  line.className = type === "error" ? "log-line error" : "log-line";
  log.prepend(line);

  while (log.children.length > MAX_LOG_LINES) {
    log.removeChild(log.lastElementChild);
  }

  typeWriter(line, text, { onTick: () => (log.scrollLeft = 0) });
  log.scrollLeft = 0;
}

function persist() {
  renderTree();
  saveState();
}

function showQuery(label, value) {
  logLine(`${label}: ${value}`);
}

function showError(msg, invalidIds = []) {
  logLine(msg, "error");
  invalidIds.forEach((id) =>
    document.getElementById(id).classList.add("invalid"),
  );
}

function val(id) {
  return document.getElementById(id).value.trim();
}
function num(id) {
  return parseInt(document.getElementById(id).value, 10);
}
function clear(id) {
  document.getElementById(id).value = "";
}

document.getElementById("btn-build").addEventListener("click", () => {
  const raw = val("build-vals");
  if (!raw)
    return showError("build tree: enter comma-separated numbers.", [
      "build-vals",
    ]);
  const values = raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => !Number.isNaN(v));
  if (!values.length)
    return showError("build tree: no valid numbers found.", ["build-vals"]);
  tree = new Tree(values);
  clear("build-vals");
  persist();
  logLine(`buildTree([${values.join(", ")}])`);
});

document.getElementById("btn-insert").addEventListener("click", () => {
  const v = num("insert-val");
  if (isNaN(v)) return showError("insert: enter a number.", ["insert-val"]);
  tree.insert(v);
  clear("insert-val");
  persist();
  logLine(`insert(${v})`);
});

document.getElementById("btn-delete").addEventListener("click", () => {
  const v = num("delete-val");
  if (isNaN(v)) return showError("delete: enter a number.", ["delete-val"]);
  tree.deleteItem(v);
  clear("delete-val");
  persist();
  logLine(`deleteItem(${v})`);
});

document.getElementById("btn-rebalance").addEventListener("click", () => {
  tree.rebalance();
  persist();
  logLine("rebalance()");
});

document.getElementById("btn-includes").addEventListener("click", () => {
  const v = num("includes-val");
  if (isNaN(v)) return showError("includes: enter a number.", ["includes-val"]);
  showQuery(`includes(${v})`, tree.includes(v));
});

document.getElementById("btn-height").addEventListener("click", () => {
  const v = num("height-val");
  if (isNaN(v)) return showError("height: enter a number.", ["height-val"]);
  const result = tree.height(v);
  showQuery(`height(${v})`, result !== undefined ? result : "not found");
});

document.getElementById("btn-depth").addEventListener("click", () => {
  const v = num("depth-val");
  if (isNaN(v)) return showError("depth: enter a number.", ["depth-val"]);
  const result = tree.depth(v);
  showQuery(`depth(${v})`, result !== undefined ? result : "not found");
});

document.getElementById("btn-balanced").addEventListener("click", () => {
  showQuery("isBalanced()", tree.isBalanced());
});

function showTraversal(label, method) {
  const values = [];
  tree[method]((v) => values.push(v));
  showQuery(label, values.length ? `[${values.join(", ")}]` : "[]");
}

document.getElementById("btn-level").addEventListener("click", () => {
  showTraversal("levelOrder()", "levelOrderForEach");
});
document.getElementById("btn-inorder").addEventListener("click", () => {
  showTraversal("inOrder()", "inOrderForEach");
});
document.getElementById("btn-preorder").addEventListener("click", () => {
  showTraversal("preOrder()", "preOrderForEach");
});
document.getElementById("btn-postorder").addEventListener("click", () => {
  showTraversal("postOrder()", "postOrderForEach");
});

// ── "How it works" modal ──
const howModal = document.getElementById("how-modal");
const howModalCode = document.getElementById("how-modal-code");

function renderCode(code) {
  howModalCode.replaceChildren();
  code.split("\n").forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = line.trim().startsWith("//")
      ? "code-line comment"
      : "code-line";
    lineEl.textContent = line.length ? line : " ";
    howModalCode.appendChild(lineEl);
  });
}

document.getElementById("btn-how").addEventListener("click", () => {
  renderCode(BST_SOURCE);
  howModal.showModal();
});
document
  .getElementById("how-modal-close")
  .addEventListener("click", () => howModal.close());
howModal.addEventListener("click", (e) => {
  if (e.target === howModal) howModal.close();
});

// Quality of life: Enter runs the row's command, typing clears its error state.
document.querySelectorAll(".cmd-row input").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    input.closest(".cmd-row").querySelector("button.run").click();
  });
  input.addEventListener("input", () => input.classList.remove("invalid"));
});

loadState();
renderTree();
