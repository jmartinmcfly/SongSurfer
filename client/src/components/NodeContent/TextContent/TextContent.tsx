import React from 'react'
import { IContentProps } from '../contentInterface'
import './TextContent.scss'

/** Render the content of a text node */
export const TextContent = (props: IContentProps) => {
  /**
   * TODO: Implement TextContent!
   * Feel free to style your text however you see fit
   */
  const { content } = props
  return <div className="textContent"> {content} </div>
}
