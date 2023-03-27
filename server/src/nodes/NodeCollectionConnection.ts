import {
  IServiceResponse,
  failureServiceResponse,
  successfulServiceResponse,
} from '../types'
import { MongoClient } from 'mongodb'

/**
 * NodeCollectionConnection acts as an in-between communicator between
 * the MongoDB database and NodeGateway. NodeCollectionConnection
 * defines methods that interact directly with MongoDB. That said,
 * it does not include any of the complex logic that NodeGateway has.
 *
 * For example:
 * NodeCollectionConnection.deleteNode() will only delete a single node.
 * NodeGateway.deleteNode() deletes all its children from the database
 * as well.
 *
 * @param {MongoClient} client
 * @param {string} collectionName
 */
export class NodeCollectionConnection {
  client: MongoClient
  collectionName: string

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.client = mongoClient
    this.collectionName = collectionName ?? 'nodes'
  }

  /**
   * Inserts a new node into the database
   * Returns successfulServiceResponse with empty array when no nodes found.
   * @param {string[]} nodeIds
   * @return successfulServiceResponse<INode[]>
   *
   * TODO (Lab 1):
   * 1. Use the isINode helper method to check the nodes validity
   */
  async insertNode(node: any): Promise<IServiceResponse<any>> {
    /*
		if (!isINode(node)) {
      return failureServiceResponse(
        'Failed to insert node due to improper input to nodeCollectionConnection.insert node.'
      )
    }

		// call mongodb function to insert node and return the inserted node
		const insertResponse = await this.client
			.db()
			.collection(this.collectionName)
			.insertOne(node)
		if (insertResponse.insertedCount) {
			return successfulServiceResponse(insertResponse.ops[0])
		} else {
			return failureServiceResponse('Failted to insert node, insertCount: ' + insertResponse.insertedCount)
		}
		*/
    return failureServiceResponse('Not implemented.')
  }

  /**
   * Clears the entire node collection in the database.
   * @param {string} nodeId
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async findNodeById(nodeId: string): Promise<IServiceResponse<any>> {
    const findResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOne({ nodeId: nodeId })
    if (findResponse == null) {
      return failureServiceResponse('Failed to find node with this nodeId.')
    } else {
      return successfulServiceResponse(findResponse)
    }
  }

  /**
   * Finds nodes when given a list of nodeIds.
   * Returns successfulServiceResponse with empty array when no nodes found.
   * @param {string[]} nodeIds
   * @return successfulServiceResponse<INode[]>
   */
  async findNodesById(nodeIds: string[]): Promise<IServiceResponse<any[]>> {
    const foundNodes: any[] = []
    await this.client
      .db()
      .collection(this.collectionName)
      .find({ nodeId: { $in: nodeIds } })
      .forEach(function (doc) {
        foundNodes.push(doc)
      })
    return successfulServiceResponse(foundNodes)
  }

  /**
   * Updates node when given a nodeId and a set of properties to update.
   * @param {string} nodeId
   * @param {Object} properties to update in MongoDB
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async updateNode(
    nodeId: string,
    updatedProperties: Object
  ): Promise<IServiceResponse<any>> {
    const updateResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOneAndUpdate({ nodeId: nodeId }, { $set: updatedProperties })
    if (updateResponse.ok && updateResponse.lastErrorObject.n) {
      return successfulServiceResponse(updateResponse.value)
    }
    return failureServiceResponse(
      'Failed to update node, lastErrorObject: ' +
        updateResponse.lastErrorObject.toString()
    )
  }

  /**
   * Deletes node with the given nodeId.
   * @param {string} nodeId
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    const collection = await this.client.db().collection(this.collectionName)
    const deleteResponse = await collection.deleteOne({ nodeId: nodeId })
    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to delete')
  }

  /**
   * Deletes nodes when given a list of nodeIds.
   * @param {string[]} nodeIds
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
    const collection = await this.client.db().collection(this.collectionName)
    const myquery = { nodeId: { $in: nodeIds } }
    const deleteResponse = await collection.deleteMany(myquery)
    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to update nodes')
  }

  /**
   * Clears the entire node collection in the database.
   * @return successfulServiceResponse on success
   *         failureServiceResponse on failure
   */
  async clearNodeCollection(): Promise<IServiceResponse<{}>> {
    const response = await this.client.db().collection(this.collectionName).deleteMany({})
    if (response.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to clear node collection.')
  }
}
