import React from 'react'
import { IContentProps } from '../contentInterface'
import './ImageContent.scss'

/** Render the content of an image node */
export const ImageContent = (props: IContentProps) => {
  /**
   * TODO: (Lab) Implement ImageContent!
   * Remember, the `content` of an image node is the image url
   */
  const { content } = props

  return (
    <img src={content} />
  )
}
