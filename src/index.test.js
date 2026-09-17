/**
 * Test suite for index.js
 * Add your tests here to verify the functionality of your main code
 */

import { Tree } from "./index.js";

test("buildTree creates a balanced tree from an unsorted array with duplicates", () => {
  const tree = new Tree([8, 3, 3, 10, 1, 6, 14, 4, 7, 13]);
  expect(tree.isBalanced()).toBe(true);
  const inOrder = [];
  tree.inOrderForEach((v) => inOrder.push(v));
  expect(inOrder).toEqual([1, 3, 4, 6, 7, 8, 10, 13, 14]);
});

test("includes finds values present in the tree, and not values absent from it", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  expect(tree.includes(6)).toBe(true);
  expect(tree.includes(99)).toBe(false);
});

test("insert adds a new leaf without disturbing existing structure", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  tree.insert(5);
  expect(tree.includes(5)).toBe(true);
  const inOrder = [];
  tree.inOrderForEach((v) => inOrder.push(v));
  expect(inOrder).toEqual([1, 3, 4, 5, 6, 7, 8, 10, 13, 14]);
});

test("deleteItem removes a leaf, a node with one child, and a node with two children", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  tree.deleteItem(4); // leaf
  tree.deleteItem(14); // one child (13)
  tree.deleteItem(3); // two children (1, 6)
  const inOrder = [];
  tree.inOrderForEach((v) => inOrder.push(v));
  expect(inOrder).toEqual([1, 6, 7, 8, 10, 13]);
  expect(tree.includes(4)).toBe(false);
});

test("levelOrderForEach visits nodes breadth-first", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  const order = [];
  tree.levelOrderForEach((v) => order.push(v));
  expect(order).toEqual([7, 3, 10, 1, 4, 8, 13, 6, 14]);
});

test("preOrderForEach and postOrderForEach visit nodes in the expected order", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  const pre = [];
  tree.preOrderForEach((v) => pre.push(v));
  expect(pre).toEqual([7, 3, 1, 4, 6, 10, 8, 13, 14]);

  const post = [];
  tree.postOrderForEach((v) => post.push(v));
  expect(post).toEqual([1, 6, 4, 3, 8, 14, 13, 10, 7]);
});

test("height and depth report position within the tree", () => {
  const tree = new Tree([8, 3, 10, 1, 6, 14, 4, 7, 13]);
  expect(tree.height(7)).toBe(3);
  expect(tree.height(1)).toBe(0);
  expect(tree.depth(7)).toBe(0);
  expect(tree.depth(1)).toBe(2);
  expect(tree.height(99)).toBeUndefined();
  expect(tree.depth(99)).toBeUndefined();
});

test("isBalanced and rebalance", () => {
  const tree = new Tree([1, 2, 3, 4, 5]);
  tree.insert(6);
  tree.insert(7);
  tree.insert(8);
  expect(tree.isBalanced()).toBe(false);
  tree.rebalance();
  expect(tree.isBalanced()).toBe(true);
  const inOrder = [];
  tree.inOrderForEach((v) => inOrder.push(v));
  expect(inOrder).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
