import "./styles.css";

class Node {
  constructor(data) {
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
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return true;
      current = value < current.data ? current.left : current.right;
    }
    return false;
  }

  insert(value) {
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
    function deleteNode(node, value) {
      if (node === null) return null;
      if (value < node.data) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.data) {
        node.right = deleteNode(node.right, value);
      } else {
        if (node.left === null && node.right === null) return null;
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
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
    if (typeof callback !== "function")
      throw new Error("A callback is required");
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
    if (typeof callback !== "function")
      throw new Error("A callback is required");
    const traverse = (node) => {
      if (node === null) return;
      traverse(node.left);
      callback(node.data);
      traverse(node.right);
    };
    traverse(this.root);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function")
      throw new Error("A callback is required");
    const traverse = (node) => {
      if (node === null) return;
      callback(node.data);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function")
      throw new Error("A callback is required");
    const traverse = (node) => {
      if (node === null) return;
      traverse(node.left);
      traverse(node.right);
      callback(node.data);
    };
    traverse(this.root);
  }

  height(value) {
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
    let current = this.root;
    let depth = 0;
    while (current !== null && current.data !== value) {
      depth++;
      current = value < current.data ? current.left : current.right;
    }
    return current === null ? undefined : depth;
  }

  isBalanced() {
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
    const values = [];
    this.inOrderForEach((value) => values.push(value));
    this.root = this.buildTree(values);
  }
}

export { Tree, Node };
