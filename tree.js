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
        const sorted = [... new Set(array)].sort((a, b) => a - b);
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
            if (value === current.data) {
                return true;
            } else if (value < current.data) {
                current = current.left;
            } else if (value > current.data) {
                current = current.right;
            }
        }
        return false;
    }

    insert(value) {
        if (this.root === null) { this.root = new Node(value); return; }
        let current = this.root;
        while (current !== null) {
            if (value === current.data) {
                return;
            } else if (value < current.data) {
                if (current.left === null) {
                    current.left = new Node(value);
                    return;
                }
                current = current.left;
            } else if (value > current.data) {
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
                if (node.left === null && node.right === null) {
                    return null;
                } else if (node.left === null) {
                    return node.right;
                } else if (node.right === null) {
                    return node.left;
                } else {
                    let successor = node.right;
                    while (successor.left !== null) {
                        successor = successor.left;
                    }
                    node.data = successor.data;
                    node.right = deleteNode(node.right, successor.data);
                }
            }
            return node;
        }

        this.root = deleteNode(this.root, value);
        //ITERATIVE METHOD
        // let current = this.root;
        // let parent = null;
        // while (current !== null) {
        //     if (value === current.data) {
        //         break;
        //     } else if (value < current.data) {
        //         parent = current;
        //         current = current.left;
        //     } else if (value > current.data) {
        //         parent = current;
        //         current = current.right;
        //     };
        // }
        // if (current === null) return;
        // if (current.left === null && current.right === null) {
        //     if (parent === null) {
        //         this.root = null
        //     } else if (current.data < parent.data) {
        //         parent.left = null;
        //     } else if (current.data > parent.data) {
        //         parent.right = null;
        //     }
        // } else if (current.left === null || current.right === null) {
        //     const child = current.left !== null ? current.left : current.right;
        //     if (parent === null) {
        //         this.root = child;
        //     } else if (current.data < parent.data) {
        //         parent.left = child;                
        //     } else if (current.data > parent.data) {
        //         parent.right = child;
        //     }
        // } else if (current.left !== null && current.right !== null) {
        //     let successor = current.right;
        //     let successorParent = current;
        //     while (successor.left !== null) {
        //         successorParent = successor; 
        //         successor = successor.left;
        //     }
        //     current.data = successor.data;
        //     if (successor.left === null && successor.right === null) {
        //        if (successor.data < successorParent.data) {
        //             successorParent.left = null;
        //         } else if (successor.data > successorParent.data) {
        //             successorParent.right = null;
        //         }
        //     } else if (successor.left === null || successor.right === null) {
        //         const child = successor.left !== null ? successor.left : successor.right;
        //         if (successor.data < successorParent.data) {
        //             successorParent.left = child;
        //         } else if (successor.data > successorParent.data) {
        //             successorParent.right = child;
        //         }
        //     }
    }

    levelOrderForEach(callback) {
        //ITERATIVE METHOD
        // if (typeof callback !== "function") throw new Error("A callback is required");
        // if (this.root === null) return;
        // const queue = [this.root];
        // while (queue.length>0) {
        //     let firstNode = queue.shift(0);
        //     callback(firstNode.data);
        //     if (firstNode.left !== null) queue.push(firstNode.left);
        //     if (firstNode.right !== null) queue.push(firstNode.right);
        // }
        if (typeof callback !== "function") throw new Error("A callback is required");
        if (this.root === null) return;
        const queue = [this.root];
        function recurse(queue) {
            if (queue.length === 0) return;
            let firstNode = queue.shift(0);
            callback(firstNode.data);
            if (firstNode.left !== null) queue.push(firstNode.left);
            if (firstNode.right !== null) queue.push(firstNode.right);
            recurse(queue);
        }
        recurse(queue);
    }

    inOrderForEach(callback) {
        if (typeof callback !== "function") throw new Error("A callback is required");
        if (this.root === null) return;
        function traverse(node) {
            if (node === null) return;
            traverse(node.left);
            callback(node.data);
            traverse(node.right);
        }
        traverse(this.root);
    }

    preOrderForEach(callback) {
        if (typeof callback !== "function") throw new Error("A callback is required");
        if (this.root === null) return;
        function traverse(node) {
            if (node === null) return;
            callback(node.data);
            traverse(node.left);
            traverse(node.right);
        }
        traverse(this.root);
    }

    postOrderForEach(callback) {
        if (typeof callback !== "function") throw new Error("A callback is required");
        if (this.root === null) return;
        function traverse(node) {
            if (node === null) return;
            traverse(node.left);
            traverse(node.right);
            callback(node.data);
        }
        traverse(this.root);
    }

    height(value) {
        let current = this.root;
        while (current !== null) {
            if (value === current.data) {
                break;
            } else if (value < current.data) {
                current = current.left;
            } else if (value > current.data) {
                current = current.right;
            }
        }
        if (current === null) return undefined;
        return height(current);
        function height(current) {
            if (current === null) return -1;
            return 1 + Math.max(height(current.left), height(current.right));
        }
    }

    depth(value) {
        let current = this.root;
        let depth = 0;
        while (current !== null) {
            if (value === current.data) {
                break;
            } else if (value < current.data) {
                depth++
                current = current.left;
            } else if (value > current.data) {
                depth++
                current = current.right;
            }
        }
        if (current === null) return undefined;
        return depth;
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

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null || node === undefined) return;
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

let randomArray = function (size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100));
    }
    return arr;
}

const bst = new Tree(randomArray(15));
console.log("Is balanced:", bst.isBalanced());
prettyPrint(bst.root);
const levelOrder = [];
bst.levelOrderForEach((v) => levelOrder.push(v));
console.log("Level order:", levelOrder);
const inOrder = [];
bst.inOrderForEach((v) => inOrder.push(v));
console.log("in order:", inOrder);
const preOrder = [];
bst.preOrderForEach((v) => preOrder.push(v));
console.log("pre order:", preOrder);
const postOrder = [];
bst.postOrderForEach((v) => postOrder.push(v));
console.log("post order:", postOrder);
bst.insert(101);
bst.insert(102);
bst.insert(103);
console.log("Is balanced:", bst.isBalanced());
bst.rebalance();
console.log("Is balanced:", bst.isBalanced());
prettyPrint(bst.root);
const levelOrder2 = [];
bst.levelOrderForEach((v) => levelOrder2.push(v));
console.log("Level order:", levelOrder2);
const inOrder2 = [];
bst.inOrderForEach((v) => inOrder2.push(v));
console.log("in order:", inOrder2);
const preOrder2 = [];
bst.preOrderForEach((v) => preOrder2.push(v));
console.log("pre order:", preOrder2);
const postOrder2 = [];
bst.postOrderForEach((v) => postOrder2.push(v));
console.log("post order:", postOrder2);
