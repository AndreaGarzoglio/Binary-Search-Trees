# Binary Search Tree

A from-scratch JavaScript implementation of a balanced Binary Search Tree,
paired with a small interactive web app that draws the tree as a branching
diagram and updates it live as you run commands.

The app uses a "terminal" style interface: monospace font, a live tree
diagram at the top, and a command panel split into `mutate` (operations
that change the tree) and `query` (read-only operations).

## Project structure

```
src/
├── index.html            # UI markup
├── index.js              # the Node and Tree classes
├── main.js               # wires the UI to the class (tree diagram, event listeners, log, state)
├── annotated-source.js   # a commented copy of the classes, shown in the "how it works" modal
├── styles.css             # "terminal" theme (JetBrains Mono, dark, violet)
├── favicon.svg            # browser tab icon / app logo
├── index.test.js         # unit tests (Jest)
└── __mocks__/
    └── styleMock.js      # CSS mock used by the tests
```

Config files in the repo root: `webpack.config.js`, `babel.config.cjs`,
`eslint.config.js`, `jest.config.cjs`, `.prettierrc` / `.prettierignore`,
plus a `.husky/pre-commit` hook that runs `prettier` on staged files.

## The classes

Each `Node` holds a `data` value and pointers to a `left` and `right`
child. The BST invariant — everything in a node's left subtree is
smaller, everything in its right subtree is bigger — is what makes
lookup, insert and delete all run in O(height) instead of O(n).

- `buildTree(array)`: dedupes and sorts the array, then recursively picks
  the middle element as each subtree's root, producing a balanced tree.
- `insert(value)` / `deleteItem(value)`: add or remove a value, keeping
  the BST invariant intact. Deleting a node with two children swaps in
  its in-order successor.
- `includes(value)`: checks whether a value is present.
- `levelOrderForEach(callback)`: breadth-first traversal.
- `inOrderForEach` / `preOrderForEach` / `postOrderForEach(callback)`:
  the three depth-first traversal orders.
- `height(value)`: longest path (in edges) from a node down to a leaf.
- `depth(value)`: path (in edges) from the root down to a node.
- `isBalanced()`: true if every node's two subtrees differ in height by
  at most 1.
- `rebalance()`: reads the tree back out in sorted order and rebuilds it
  balanced.

## The interactive UI

- a **tree diagram** at the top: nodes are laid out by an in-order pass
  (so left children always stay left of right children) and connected
  by branches drawn as SVG lines, redrawn live after every command;
- a **"how it works"** button next to the title that opens a modal with a
  commented copy of the source (`annotated-source.js`);
- a **mutate** panel (`build tree`, `insert`, `delete`, `rebalance`) and
  a **query** panel (`includes`, `height`, `depth`, `is balanced`, and
  the four traversal orders), side by side;
- a **log** pinned at the bottom, always visible: it tracks the latest
  commands and any errors, newest first, scrolling horizontally.

The tree's contents are saved to `localStorage` (as its sorted values),
so it survives a page reload.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server (webpack-dev-server) with hot reload
npm run build     # production build, output in docs/
npm run lint      # run eslint on src/
npm test          # run the Jest tests
npm run test:watch
```
