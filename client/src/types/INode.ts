import IFilePath, { makeIFilePath } from './IFilePath'

/**
 * nodeTypes returns a string array of the types available
 */
export const nodeTypes: string[] = ['text', 'image', 'folder']

/**
 * Supported nodeTypes for file browser
 */
export type NodeType = 'text' | 'image' | 'folder' | 'pdf' | 'audio' | 'video'

/**
 * INode with node metadata
 */
export interface INode {
  title: string // user create node title
  type: NodeType // type of node that is created
  content: any // the content of the node
  nodeId: string // unique randomly generated ID which contains the type as a prefix
  filePath: IFilePath // the location properties of the node (file path)
  dateCreated?: Date // date that the node was created
}
export type NodeFields = keyof INode

// Type decleration for map from nodeId --> INode
export type NodeIdsToNodes = { [nodeId: string]: INode }

/**
 * Function that determinds if a given node is a valid INode
 * @param object
 * @returns
 */
export function isINode(object: any): object is INode {
  const propsDefined: boolean =
    typeof (object as INode).nodeId !== 'undefined' &&
    typeof (object as INode).title !== 'undefined' &&
    typeof (object as INode).type !== 'undefined' &&
    typeof (object as INode).content !== 'undefined' &&
    typeof (object as INode).filePath !== 'undefined'
  const filePath: IFilePath = object.filePath
  if (filePath && propsDefined) {
    for (let i = 0; i < filePath.path.length; i++) {
      if (typeof filePath.path[i] !== 'string') {
        return false
      }
    }
    return (
      typeof (object as INode).nodeId === 'string' &&
      typeof (object as INode).title === 'string' &&
      nodeTypes.includes((object as INode).type) &&
      typeof (object as INode).content === 'string' &&
      filePath.path.length > 0 &&
      filePath.path[filePath.path.length - 1] === (object as INode).nodeId
    )
  } else {
    return false
  }
}

/**
 * Function that creates an INode given relevent inputs
 * @param nodeId
 * @param path
 * @param children
 * @param type
 * @param title
 * @param content
 * @returns
 */
export function makeINode(
  nodeId: any,
  path: any,
  children?: any,
  type?: any,
  title?: any,
  content?: any
): INode {
  return {
    nodeId: nodeId,
    title: title ?? 'node' + nodeId,
    type: type ?? 'text',
    content: content ?? 'content' + nodeId,
    filePath: makeIFilePath(path, children),
  }
}
