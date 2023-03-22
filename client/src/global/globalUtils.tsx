import React from 'react'
import * as fa from 'react-icons/fa'
import { NodeType } from '../types'
import IFilePath from '../types/IFilePath'

export const nodeTypeIcon = (type: NodeType): JSX.Element => {
  switch (type) {
    case 'text':
      return <fa.FaStickyNote />
    case 'video':
      return <fa.FaVideo />
    case 'folder':
      return <fa.FaFolder />
    case 'image':
      return <fa.FaImage />
    case 'pdf':
      return <fa.FaFilePdf />
    default:
      return <fa.FaQuestion />
  }
}

export const pathToString = (filePath: IFilePath): string => {
  let urlPath: string = ''
  if (filePath.path) {
    for (const id of filePath.path) {
      urlPath = urlPath + id + '/'
    }
  }
  return urlPath
}

/**
 * Helpful for filtering out null and undefined values
 * @example
 * const validNodes = myNodes.filter(isNotNullOrUndefined)
 */
export const isNotNullOrUndefined = (data: any) => {
  return data != null
}
