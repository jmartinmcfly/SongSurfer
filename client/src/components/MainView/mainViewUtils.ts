import { INode, makeINode, NodeIdsToNodes } from '../../types'
import { traverseTree, TreeWrapper } from '../../types/TreeWrapper'

export const createNodeIdsToNodesMap = (rootNodes: any) => {
  const result: NodeIdsToNodes = {}
  for (const root of rootNodes) {
    traverseTree(root, (tree) => {
      result[tree.node.nodeId] = tree.node
    })
  }
  return result
}

export const makeRootWrapper = (rootNodes: any) => {
  const rootTreeWrapper: TreeWrapper = {
    node: makeINode('root', [], [], 'folder', 'MyHypermedia Dashboard', ''),
    children: rootNodes,
    addChild: () => null,
  }
  return rootTreeWrapper
}

export const emptyNode: INode = makeINode(
  '404',
  [],
  [],
  'text',
  'Error 404',
  'Empty node'
)
