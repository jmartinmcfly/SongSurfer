import React, { useState } from 'react'
import { FaCaretRight, FaFolderOpen } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { nodeTypeIcon, pathToString } from '../../../global'
import { INode, NodeType } from '../../../types'
import { TreeWrapper } from '../../../types/TreeWrapper'
import './TreeViewItem.scss'

interface ITreeViewProps {
  node: INode
  type: NodeType
  title: string
  childNodes: TreeWrapper[]
  selected: INode | null
  setSelected: (node: INode) => void
  linkTo?: boolean
}

export const TreeViewItem = ({
  node,
  type,
  title,
  childNodes,
  selected,
  setSelected,
  linkTo,
}: ITreeViewProps) => {
  let childrenItems: JSX.Element[] = []
  if (childNodes.length) {
    childrenItems = childNodes.map((tree: TreeWrapper) => {
      return (
        <TreeViewItem
          node={tree.node}
          selected={selected}
          setSelected={setSelected}
          key={tree.node.nodeId}
          type={tree.node.type}
          title={tree.node.title}
          childNodes={tree.children}
        />
      )
    })
  }

  const [isOpen, toggleOpen] = useState(false)
  const toggleFolder = () => {
    toggleOpen(!isOpen)
  }

  const TreeViewChild = () => {
    return (
      <div
        className={`item-wrapper ${isSelected}`}
        onClick={() => {
          setSelected(node)
        }}
      >
        {hasChildren ? (
          <div className={`icon-hover ${hasChildren}`} onClick={toggleFolder}>
            <div
              className="icon-wrapper"
              style={{
                transform: hasChildren && isOpen ? 'rotate(90deg)' : undefined,
              }}
            >
              {<FaCaretRight />}
            </div>
          </div>
        ) : null}
        <div className={'icon-hover'}>
          <div className="icon-wrapper">{icon}</div>
        </div>
        <div className="text-wrapper">{title}</div>
      </div>
    )
  }
  let icon = nodeTypeIcon(type)
  const hasChildren: boolean = childNodes.length > 0
  const isSelected: boolean = selected != null && selected.nodeId === node.nodeId
  if (type === 'folder' && isOpen) icon = <FaFolderOpen />
  return (
    <div className="treeView-item">
      {linkTo ? (
        <Link to={`/${pathToString(node.filePath)}`}>
          <TreeViewChild />
        </Link>
      ) : (
        <TreeViewChild />
      )}
      <div className={`item-children ${isOpen}`}>{childrenItems}</div>
    </div>
  )
}
