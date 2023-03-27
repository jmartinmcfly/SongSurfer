import { MongoClient } from 'mongodb'
import {
  failureServiceResponse,
  IServiceResponse,
  successfulServiceResponse,
} from '../types'
import { NodeCollectionConnection } from './NodeCollectionConnection'

/**
 * NodeGateway handles requests from NodeRouter, and calls on methods
 * in NodeCollectionConnection to interact with the database. It contains
 * the complex logic to check whether the request is valid, before
 * modifying the database.
 *
 * Example:
 * Before insertion, NodeGateway.createNode() will check whether the database
 * already contains a node with the same nodeId, as well as the the validity of
 * node's file path. In comparison, the NodeCollectionConnection.insertNode()
 * method simply retrieves the node object, and inserts it into the database.
 */
export class NodeGateway {
  nodeCollectionConnection: NodeCollectionConnection

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.nodeCollectionConnection = new NodeCollectionConnection(
      mongoClient,
      collectionName ?? 'nodes'
    )
  }

  /**
   * Method to create a node and insert it into the database.
   *
   * TODO (Lab 1):
   * 1. Check if node is valid INode
   * 2. Check whether the nodeId already exists in the database
   * 3. Check whether the parent exists in database
   * 4. Check whether the parent filePath agrees with child filePath
   * 5. Update parent's filePath.children field
   * 6. Insert node into database
   *
   * @param nodeId - The nodeId of the node to be created.
   */
  async createNode(node: any): Promise<IServiceResponse<any>> {
    /*
		// check if node is valid node
		const isValidNode = isINode(node)
		if (!isValidNode) {
			return failureServiceResponse('Not a valid Node')
		}
		// check whether nodeId is already in the db
		const nodeResponse = await this.nodeCollectionConnection.findNodeById(
			node.nodeId
		)
		if (nodeResponse.success) {
			return failureServiceResponse(
				'Node with same ID already exists in the db'
			)
		}

		const insertNodeResp = await this.nodeCollectionConnection.insertNode(node)
		return insertNodeResp
		*/
    return failureServiceResponse('[NodeGateway] createNode is not implemented')
  }

  /**
   * Method to retrieve node with a given nodeId.
   *
   * TODO:
   * 1. Call on NodeCollectionConnection method to retrieve node
   *
   * @param nodeId - The nodeId of the node to be retrieved.
   * @returns IServiceResponse<INode>
   */
  async getNodeById(nodeId: string): Promise<IServiceResponse<any>> {
    return failureServiceResponse('[NodeGateway] getNodeById is not implemented')
  }

  /**
   * Method to delete node with the given nodeId, and all of its children.
   *
   * TODO:
   * 1. Call this.getTreeByRoot() to get the node with all its descendants
   * 2. Call this.recursivelyDeleteTree() to perform the deletion
   * 3. Remove nodeId from parent's filePath.children by calling removeChild()
   *
   * @param nodeId the nodeId of the node
   * @returns Promise<IServiceResponse<{}>>
   */
  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    return failureServiceResponse('TODO: [NodeGateway] deleteNode not implemented')
  }

  /**
   * Method to update the node with the given nodeId.
   * @param nodeId the nodeId of the node
   * @param toUpdate an array of INodeProperty
   *
   * @returns IServiceResponse<INode>
   */
  async updateNode(nodeId: string, toUpdate: any[]): Promise<IServiceResponse<any>> {
    /*
		const nodeResponse = await this.nodeCollectionConnection.updateNode(
			nodeId,
			properties
		)
		if (!nodeResponse.success) {
			return failureServiceResponse('This node does not exist in the database!')
		}
		return nodeResponse
		*/
    return failureServiceResponse('[NodeGateway] updateNode is not implemented')
  }
}
