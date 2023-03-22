import React from 'react'
import { NodeType } from '../../types'
import { FolderContent } from '../NodeContent/FolderContent'
import { ImageContent } from '../NodeContent/ImageContent'
import { TextContent } from '../NodeContent/TextContent'
import { INodeViewProps } from './NodeView'

export const renderContent = (props: INodeViewProps, type: NodeType, content: any) => {
  const {
    node,
    onDeleteButtonClick,
    onMoveButtonClick,
    childNodes,
    folderContentType,
    setSelected,
  } = props
  switch (type) {
    case 'folder':
      if (childNodes && folderContentType) {
        return (
          <FolderContent
            node={node}
            onDeleteButtonClick={onDeleteButtonClick}
            onMoveButtonClick={onMoveButtonClick}
            setSelected={setSelected}
            childNodes={childNodes}
            viewType={folderContentType}
          />
        )
      }
      break
    case 'image':
    /** TODO: Return an <ImageContent /> component here */
      return < ImageContent content={content} />
    case 'text':
    /** TODO: Return a <TextContent /> component here */
      return < TextContent content={content} />
    default:
      return (
        <div className="nodeView-json">
          <pre>{JSON.stringify(node, null, 2)}</pre>
        </div>
      )
  }
}
