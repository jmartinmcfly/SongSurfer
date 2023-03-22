import React from 'react'
import { INode } from '../../types'
import { TreeWrapper } from '../../types/TreeWrapper'
import { TreeViewItem } from './TreeViewItem'
import './TreeView.scss'

/**
 *  getRoot will return:
 *  - node: INode
 *  - children: TreeWrapper[]
 */

export interface ITreeViewProps {
  roots: TreeWrapper[]
  selectedNode: INode | null
  setSelected: (node: INode) => void
  linkTo?: boolean
}

export const TreeView = (props: ITreeViewProps) => {
  const { roots, selectedNode, setSelected, linkTo = true } = props
  return (
    <div className="treeView-wrapper">
      {roots.map((tree: TreeWrapper) => (
        <TreeViewItem
          node={tree.node}
          selected={selectedNode}
          setSelected={setSelected}
          key={tree.node.nodeId}
          type={tree.node.type}
          title={tree.node.title}
          childNodes={tree.children}
          linkTo={linkTo}
        />
      ))}
    </div>
  )
}
