import { Handler, Node, HastNode, HastElementNode } from './types';
import visitNode from './visit-node';

// visitChildren() is for visiting all the children of a node
export default (async function visitChildren(createNode, parentNode, context) {
  const nodes: HastNode[] = Array.isArray(parentNode.children)
    ? parentNode.children
    : [];
  let values: Node[] = [];
  let index = -1;
  let result;

  while (++index < nodes.length) {
    result = await visitNode(createNode, nodes[index], {
      ...context,
      parentNode,
    });

    if (result) {
      if (Array.isArray(result)) {
        result = await Promise.all(
          result.map((nodeOrPromise) => {
            if (nodeOrPromise instanceof Promise) {
              return nodeOrPromise;
            }
            return Promise.resolve(nodeOrPromise);
          }),
        );
      }
      values = values.concat(result);
    }
  }

  return values;
} as Handler<HastElementNode>);
