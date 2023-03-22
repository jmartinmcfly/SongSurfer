import React from 'react'
import './Breadcrumb.scss'
import { FaAngleRight } from 'react-icons/fa'
import { isNotNullOrUndefined } from '../../global'
import { NodeIdsToNodes, INode } from '../../types'

export interface IBreadcrumbProps {
  path: string[]
  nodeIdsToNodes: NodeIdsToNodes
  setSelected: (node: INode) => void
}

/** Render a breadcrumb that shows the path from the root to the current node */
export const Breadcrumb = ({ path, nodeIdsToNodes, setSelected }: IBreadcrumbProps) => {
  /**
   * TODO: Implement your Breadcrumb here!
   * Use the props to get the data you need, then render your breadcrumb
   */
  return (
    <div className="node-breadcrumb">TODO (ASSIGNMENT 1): Implement breadcrumb here!</div>
  )
}
