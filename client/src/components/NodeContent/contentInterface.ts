/** Props needed to render any node content */
export interface IContentProps {
  /** Content is a string, for text it is the text content, for an image it is the image url */
  content: string
  /** True if the content should be rendered for a node preview */
  preview?: boolean
}
