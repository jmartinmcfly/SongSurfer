import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import NodeGateway from '../../nodes/NodeGateway'
import { INode, makeIFilePath, NodeType } from '../../types'
import IFilePath from '../../types/IFilePath'
import uniqid from 'uniqid'

export async function http<T>(request: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axios(request)
  return response.data
}

export interface ICreateNodeModalAttributes {
  title: string
  type: NodeType
  content: string
  /** If null, add node as a root */
  parentNodeId: string | null
}

/** Create a new node based on the inputted attributes in the modal */
export async function createNodeFromModal(
  attributes: ICreateNodeModalAttributes
): Promise<INode | null> {
  const { title, type, parentNodeId, content } = attributes
  const nodeId = generateNodeId(type)
  // Initial filePath value: create node as a new root
  let filePath: IFilePath = makeIFilePath([nodeId])

  // If parentNodeId is provided, we edit filePath so that we can
  // create the node as a child of the parent
  if (parentNodeId) {
    const parentNodeResponse = await NodeGateway.getNode(parentNodeId)
    if (parentNodeResponse.success) {
      const parentNode = parentNodeResponse.payload
      if (parentNode) {
        filePath = makeIFilePath(parentNode.filePath.path.concat([nodeId]))
        const newParentNode: INode = {
          ...parentNode,
          filePath: {
            ...parentNode.filePath,
            children: parentNode.filePath.children.concat(nodeId),
          },
        }
        await NodeGateway.updateNode(newParentNode)
      } else {
        console.error('Error: parent node is null')
      }
    } else {
      console.error('Could not get parent node:' + parentNodeResponse.message)
    }
  }

  const newNode: INode = {
    nodeId: nodeId,
    title: title,
    content: content,
    type: type,
    filePath: filePath,
    dateCreated: new Date(),
  }

  const nodeResponse = await NodeGateway.createNode(newNode)
  if (nodeResponse.success) {
    return nodeResponse.payload
  } else {
    console.error('Error: ' + nodeResponse.message)
    return null
  }
}

export function generateNodeId(type: NodeType) {
  return uniqid(type + '.')
}

export const uploadImage = async (file: any): Promise<string> => {
  // Begin file upload
  console.log('Uploading file to Imgur..')

  // Using key for Imgur API
  const apiUrl = 'https://api.imgur.com/3/image'
  const apiKey = 'f18e19d8cb9a1f0'

  const formData = new FormData()
  formData.append('image', file)

  try {
    const data: any = await http({
      url: apiUrl,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: 'Client-ID ' + apiKey,
        Accept: 'application/json',
      },
    })
    return data.data.link
  } catch (exception) {
    return 'Image was not uploaded'
  }
}
