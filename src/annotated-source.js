// An annotated copy of the Tree/Node classes, shown in the "how it works"
// modal. Kept separate from index.js so the real, uncommented source stays
// clean while this stays purely explanatory.

const BST_SOURCE = `class Node {
  constructor(data) {
    // Each node holds a value and pointers to (at most) two children:
    // everything smaller lives in "left", everything bigger in "right".
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    // Dedupe and sort first, then always pick the middle element as the
    // node: that's what keeps the tree balanced (height ~log n) instead
    // of degenerating into a straight line.
    const sorted = [...new Set(array)].sort((a, b) => a - b);
    const build = (start, end) => {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const node = new Node(sorted[mid]);
      node.left = build(start, mid - 1);
      node.right = build(mid + 1, end);
      return node;
    };
    return build(0, sorted.length - 1);
  }

  includes(value) {
    // The BST invariant (left < node < right) lets each step discard
    // half the remaining nodes, so lookup is O(height) instead of O(n).
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return true;
      current = value < current.data ? current.left : current.right;
    }
    return false;
  }

  insert(value) {
    // Same walk as includes: follow left/right until an empty spot
    // opens up where the new node belongs.
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return;
      if (value < current.data) {
        if (current.left === null) {
          current.left = new Node(value);
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = new Node(value);
          return;
        }
        current = current.right;
      }
    }
  }

  deleteItem(value) {
    // Recursive so each call can return the (possibly new) subtree root
    // to its parent, rewiring the tree as it unwinds.
    function deleteNode(node, value) {
      if (node === null) return null;
      if (value < node.data) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.data) {
        node.right = deleteNode(node.right, value);
      } else {
        // Found it. Three cases:
        if (node.left === null && node.right === null) return null; // leaf
        if (node.left === null) return node.right; // one child
        if (node.right === null) return node.left; // one child
        // Two children: swap in the in-order successor (smallest value
        // in the right subtree), then delete that successor from where
        // it used to live.
        let successor = node.right;
        while (successor.left !== null) successor = successor.left;
        node.data = successor.data;
        node.right = deleteNode(node.right, successor.data);
      }
      return node;
    }
    this.root = deleteNode(this.root, value);
  }

  levelOrderForEach(callback) {
    // Breadth-first: a queue visits each depth left-to-right before
    // moving to the next depth.
    if (this.root === null) return;
    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      callback(node.data);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }

  inOrderForEach(callback) {
    // left, self, right — visiting a BST this way always yields values
    // in ascending order.
    const traverse = (node) => {
      if (node === null) return;
      traverse(node.left);
      callback(node.data);
      traverse(node.right);
    };
    traverse(this.root);
  }

  preOrderForEach(callback) {
    // self, left, right — useful for cloning/serializing a tree, since
    // it visits a parent before its children.
    const traverse = (node) => {
      if (node === null) return;
      callback(node.data);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
  }

  postOrderForEach(callback) {
    // left, right, self — visits children before their parent, e.g. for
    // safely deleting a whole subtree bottom-up.
    const traverse = (node) => {
      if (node === null) return;
      traverse(node.left);
      traverse(node.right);
      callback(node.data);
    };
    traverse(this.root);
  }

  height(value) {
    // Height = number of edges on the longest path from this node down
    // to a leaf.
    let current = this.root;
    while (current !== null && current.data !== value) {
      current = value < current.data ? current.left : current.right;
    }
    if (current === null) return undefined;
    const getHeight = (node) => {
      if (node === null) return -1;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };
    return getHeight(current);
  }

  depth(value) {
    // Depth = number of edges on the path from the root down to this
    // node — the mirror image of height.
    let current = this.root;
    let depth = 0;
    while (current !== null && current.data !== value) {
      depth++;
      current = value < current.data ? current.left : current.right;
    }
    return current === null ? undefined : depth;
  }

  isBalanced() {
    // A tree is balanced when, for every node, its two subtrees' heights
    // never differ by more than 1. getHeight returns null as soon as it
    // finds an imbalance, short-circuiting the rest of the check.
    const getHeight = (node) => {
      if (node === null) return -1;
      const leftHeight = getHeight(node.left);
      if (leftHeight === null) return null;
      const rightHeight = getHeight(node.right);
      if (rightHeight === null) return null;
      if (Math.abs(leftHeight - rightHeight) > 1) return null;
      return Math.max(leftHeight, rightHeight) + 1;
    };
    return getHeight(this.root) !== null;
  }

  rebalance() {
    // Read the values back out in sorted order (an in-order traversal)
    // and hand them to buildTree, which always produces a balanced tree.
    const values = [];
    this.inOrderForEach((value) => values.push(value));
    this.root = this.buildTree(values);
  }
}`;

export { BST_SOURCE };
