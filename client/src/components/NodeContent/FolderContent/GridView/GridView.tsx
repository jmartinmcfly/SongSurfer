import React from 'react'
import { INode } from '../../../../types'
import { NodePreview } from '../../../NodePreview'
import './GridView.scss'

export type IViewType = 'list' | 'grid'

export interface GridViewProps {
  childNodes: INode[]
  setSelected: (node: INode) => void
  onDeleteButtonClick: (node: INode) => unknown
  onMoveButtonClick: (node: INode) => unknown
}

/** Grid layout of the contents of a folder */
export const GridView = (props: GridViewProps) => {
  const { childNodes, setSelected, onDeleteButtonClick, onMoveButtonClick } = props

  const nodes = childNodes.map((childNode) => (
    <NodePreview
      onDeleteButtonClick={onDeleteButtonClick}
      onMoveButtonClick={onMoveButtonClick}
      key={childNode.nodeId}
      node={childNode}
      setSelected={setSelected}
    />
  ))

  return <div className={'gridView-wrapper'}>{nodes}</div>
}
