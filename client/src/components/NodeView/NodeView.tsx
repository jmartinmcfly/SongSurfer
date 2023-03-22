import React from 'react'
import * as fa from 'react-icons/fa'
import { INode, NodeIdsToNodes } from '../../types'
import { Breadcrumb } from '../Breadcrumb'
import { Button } from '../Button'
import './NodeView.scss'
import { renderContent } from './nodeViewUtils'

export type FolderContentType = 'list' | 'grid'
export interface INodeViewProps {
  node: INode
  onDeleteButtonClick: (node: INode) => unknown
  onMoveButtonClick: (node: INode) => unknown
  /** Used for rendering the breadcrumb */
  nodeIdsToNodes: NodeIdsToNodes
  childNodes?: INode[]
  folderContentType?: FolderContentType
  setSelected: (node: INode) => void
}

/** Full page view focused on a node's content, with annotations and links */
export const NodeView = (props: INodeViewProps) => {
  /**
   * TODO: Once you start implementing your NodeView,
   * make sure you are getting all the elements you need from `props`
   */
  const { node, nodeIdsToNodes, setSelected } = props
  const {
    type,
    filePath: { path },
    content,
  } = node

  const hasBreadcrumb: boolean = path.length > 1
  return (
    <div className="nodeView">
      {hasBreadcrumb && (
        <div className="nodeView-breadcrumb">
          <Breadcrumb
            path={path}
            nodeIdsToNodes={nodeIdsToNodes}
            setSelected={setSelected}
          />
        </div>
      )}
      {/** TODO: Render the node's title, a delete button, and a move button */}
      <div
        className="nodeView-content"
        style={{
          maxHeight: hasBreadcrumb ? 'calc(100% - 118px)' : 'calc(100% - 72px)',
        }}
      >
        {renderContent(props, type, content)}
      </div>
    </div>
  )
}
