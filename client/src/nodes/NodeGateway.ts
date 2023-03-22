import { failureServiceResponse, INode, IServiceResponse, TreeWrapper } from '../types'
import { get, post, put, remove } from './request'

/** In development mode (locally) the server is at localhost:5000*/
let baseEndpoint = 'http://localhost:5000'

if (process.env.REACT_APP_BACKEND_ENV === 'production') {
  /** TODO [Deployment]: Update with your heroku backend URL*/
  baseEndpoint = ''
}

/** This is the path to the mongo collection */
const servicePath = '/node'

/**
 * [FRONTEND NODE GATEWAY]
 * NodeGateway handles HTTP requests to the host, which is located on the server.
 * This NodeGateway object uses the baseEndpoint, and additional server information
 * to access the requested information.
 *
 * These methods use the get, post, put and remove http requests from request.ts
 * helper methods to make requests to the server.
 */
const NodeGateway = {
  /**
   * createNode
   *
   * TODO: (Lab 1)
   * 1. Try to submit a POST request containing a URL and body
   * 2. Catch exceptions and return a failureServiceResponse if it is unsuccessful
   *
   * @param node
   * @returns
   */
  createNode: async (node: INode): Promise<IServiceResponse<INode>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/create'
      const body: any = { node: node }
      return await post<IServiceResponse<INode>>(url, body)
    } catch (e) {
      return failureServiceResponse('[createNode] Unable to access backend')
    }
  },
  /**
   * getNode
   *
   * @param nodeId
   * @returns
   */
  getNode: async (nodeId: string): Promise<IServiceResponse<INode>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/get/' + nodeId
      return await get<IServiceResponse<INode>>(url)
    } catch (exception) {
      return failureServiceResponse('[getNode] Unable to access backend')
    }
  },
  /**
   * deleteNode
   *
   * @param nodeId
   * @returns
   */
  deleteNode: async (nodeId: string): Promise<IServiceResponse<{}>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/' + nodeId
      return await remove<IServiceResponse<INode>>(url)
    } catch (exception) {
      return failureServiceResponse('[deleteNode] Unable to access backend')
    }
  },
  /**
   * moveNode
   *
   * @param {nodeId, newParentId}
   * - Takes in the current nodeId and the Id of the new parent where it should be moved
   * @returns the INode that has been successfully updated and moved
   */
  moveNode: async ({
    nodeId,
    newParentId,
  }: {
    nodeId: string
    newParentId: string
  }): Promise<IServiceResponse<INode>> => {
    try {
      const body = {}
      const url: string =
        baseEndpoint + servicePath + '/move/' + `${nodeId}/` + `${newParentId}/`
      return await put<IServiceResponse<INode>>(url, body)
    } catch (exception) {
      return failureServiceResponse('[moveNode] Unable to access backend')
    }
  },
  /**
   *
   * @param node
   * @returns
   */
  updateNode: async (node: INode): Promise<IServiceResponse<INode>> => {
    try {
      return await put<IServiceResponse<INode>>(baseEndpoint + servicePath, {
        node: node,
      })
    } catch (exception) {
      return failureServiceResponse('[updateNode] Unable to access backend')
    }
  },
  /**
   * This is a method that sends a request to get the root folders from '~/'
   * and then tree structure
   * @returns
   */
  getRoots: async (): Promise<IServiceResponse<TreeWrapper[]>> => {
    try {
      return await get<IServiceResponse<TreeWrapper[]>>(
        baseEndpoint + servicePath + '/roots'
      )
    } catch (exception) {
      return failureServiceResponse('[getNodeByPath] Unable to access backend')
    }
  },
}

export default NodeGateway
