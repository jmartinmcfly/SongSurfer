import React from 'react'
import { INode } from '../../../types'
import { FolderContentType } from '../../NodeView'
import './FolderContent.scss'
import { GridView } from './GridView'

export interface IFolderContentProps {
  node: INode
  childNodes: INode[]
  viewType: FolderContentType
  setSelected: (node: INode) => void
  onDeleteButtonClick: (node: INode) => unknown
  onMoveButtonClick: (node: INode) => unknown
}

/** Full page view focused on a node's content, with annotations and links */
export const FolderContent = (props: IFolderContentProps) => {
  const { childNodes, setSelected, viewType, onDeleteButtonClick, onMoveButtonClick } =
    props

  let nodes
  switch (viewType) {
    case 'grid':
      nodes = (
        // GridView component for rendering a folder's contents
        <GridView
          onDeleteButtonClick={onDeleteButtonClick}
          onMoveButtonClick={onMoveButtonClick}
          childNodes={childNodes}
          setSelected={setSelected}
        />
      )
      break
    case 'list':
      nodes = null
      break
    default:
      nodes = null
      break
  }

  return <div>{nodes}</div>
}
