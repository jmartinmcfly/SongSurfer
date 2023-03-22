import React from 'react'
import { NodeType } from '../../types'
import { ImageContent } from '../NodeContent/ImageContent'
import { TextContent } from '../NodeContent/TextContent'

export const renderContent = (type: NodeType, content: any) => {
  switch (type) {
    case 'image':
      return <ImageContent content={content} preview={true} />
    case 'text':
      return <TextContent content={content} preview={true} />
    default:
      return content
  }
}
