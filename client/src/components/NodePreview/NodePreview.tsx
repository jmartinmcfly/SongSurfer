import React from 'react'
import { Link } from 'react-router-dom'
import { nodeTypeIcon, pathToString } from '../../global'
import { INode } from '../../types'
import { FolderContentType } from '../NodeView'
import './NodePreview.scss'
import { renderContent } from './nodePreviewUtils'

export interface INodePreviewProps {
  node: INode
  onDeleteButtonClick: (node: INode) => unknown
  onMoveButtonClick: (node: INode) => unknown
  childNodes?: string[]
  folderContentType?: FolderContentType
  setSelected: (node: INode) => void
}

/** Full page view focused on a node's content, with annotations and links */
export const NodePreview = ({
  node,
  setSelected,
  onDeleteButtonClick,
  onMoveButtonClick,
}: INodePreviewProps) => {
  const { type, title, content } = node
  return (
    <Link to={`/${pathToString(node.filePath)}`}>
      <div
        className={'grid-nodePreview'}
        onClick={() => {
          setSelected(node)
        }}
      >
        <div className="content-preview">{renderContent(type, content)}</div>
        <div className="node-info">
          <div className="info-container">
            <div className="main-info">
              {nodeTypeIcon(node.type)}
              <div className="title">{title}</div>
            </div>
            <div className="sub-info">
              {node.dateCreated && (
                <div className="dateCreated">
                  {'Created on ' + new Date(node.dateCreated).toLocaleDateString('en-US')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
