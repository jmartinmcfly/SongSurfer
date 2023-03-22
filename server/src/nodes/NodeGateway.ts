import { MongoClient } from 'mongodb'
import {
	TreeWrapper,
	failureServiceResponse,
	IServiceResponse,
	successfulServiceResponse,
	INode,
	makeIFilePath,
	INodeProperty,
	makeINodeProperty,
	isINodeProperty,
	isINode,
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
	async createNode(node: any): Promise<IServiceResponse<INode>> {
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

		// check if parent exists
		const nodePath = node.filePath
		// if node is not a root
		if (nodePath.path.length > 1) {
			const parentId = nodePath.path[nodePath.path.length - 2]
			const parentResponse = await this.nodeCollectionConnection.findNodeById(
				parentId
			)
			if (
				!parentResponse.success || 
				parentResponse.payload.filePath.path.toString() !== 
					nodePath.path.slice(0, -1).toString()
			) {
				return failureServiceResponse('Node had invalid parent or filepath does not match parent.')
			}
			// add nodeId to parent's filePath.children field
			parentResponse.payload.filePath.children.push(node.nodeId)
			const updateParentResp = await this.updateNode(
				parentResponse.payload.nodeId,
				[{fieldName: 'filePath', value: parentResponse.payload.filePath}]
			)
			if (!updateParentResp.success) {
				return failureServiceResponse(
					'Failed to update parent.filePath.children.'
				)
			}
		}

		const insertNodeResp = await this.nodeCollectionConnection.insertNode(node)
		return insertNodeResp
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
	async getNodeById(nodeId: string): Promise<IServiceResponse<INode>> {
		return failureServiceResponse('[NodeGateway] getNodeById is not implemented')
	}

	/**
	 * Method to delete all nodes in the database.
	 *
	 * TODO:
	 * 1. Call on respective method in nodeCollectionConnection
	 *
	 * @returns IServiceResponse<{}>
	 */
	async deleteAll(): Promise<IServiceResponse<{}>> {
		return failureServiceResponse('TODO: [NodeGateway] deleteAll() not implemented')
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
	 * Method to remove a child's nodeId from parent node's filePath.children.
	 *
	 * TODO:
	 * 1. Retrieve the parent node with parentId
	 * 2. Remove the child's nodeId from parent's filePath.children
	 * 3. Update the parent node with the new filePath
	 *
	 * @param childId the nodeId of the child
	 * @param parentId the nodeId of the parent
	 */
	async removeChild(childId: string, parentId: string): Promise<IServiceResponse<{}>> {
		return failureServiceResponse('TODO: [NodeGateway] removeChild not implemented')
	}

	/**
	 * Move a node by updating its filepath and its new and old
	 * parent's filePath.children. Returns the updated node.
	 * Note, newParentNodeId = '~' implies that the node will be
	 * moved to become a root node
	 *
	 * TODO:
	 * 1. Retrieve the target node
	 * 2. If newParentNodeId is not '~', add child to new parent's filePath.children
	 * 3. If nodeToMove is not a root, update original parent's filePath.children
	 * 4. Call recursivelyUpdatePath() to update node's descendent's filePath
	 * 5. Fetch and return the updated node from the database
	 *
	 * @param nodeToMoveId the nodeId of the node to move
	 * @param newParentId the nodeId of the new parent
	 */
	async moveNode(nodeToMoveId: string, newParentNodeId: string) {
		return failureServiceResponse('TODO: [NodeGateway] moveNode() not implemented')
	}

	/**
	 * Method to add a child's nodeId to parent node's filePath.children.
	 *
	 * TODO:
	 * 1. Retrieve the parent node with parentId
	 * 2. Add the child's nodeId to parent's filePath.children
	 * 3. Update the parent node with the new filePath
	 *
	 * @param childId the nodeId of the child
	 * @param parentId the nodeId of the parent
	 * @returns
	 */
	async addChild(childId: string, parentId: string): Promise<IServiceResponse<{}>> {
		return failureServiceResponse('TODO: [NodeGateway] addChild() not implemented')
	}

	/**
	 * Method to update the node with the given nodeId.
	 * @param nodeId the nodeId of the node
	 * @param toUpdate an array of INodeProperty
	 *
	 * @returns IServiceResponse<INode>
	 */
	async updateNode(
		nodeId: string,
		toUpdate: INodeProperty[]
	): Promise<IServiceResponse<INode>> {
		const properties: any = {}
		for (let i = 0; i < toUpdate.length; i++) {
			if (!isINodeProperty(toUpdate[i])) {
				return failureServiceResponse('toUpdate parameters invalid')
			}
			const fieldName = toUpdate[i].fieldName
			const value = toUpdate[i].value
			properties[fieldName] = value
		}
		const nodeResponse = await this.nodeCollectionConnection.updateNode(
			nodeId,
			properties
		)
		if (!nodeResponse.success) {
			return failureServiceResponse('This node does not exist in the database!')
		}
		return nodeResponse
	}

	/**
	 * Method to retrieve the node tree, where the root is the node with
	 * the given nodeId.
	 * @param nodeId - The nodeId of the node.
	 * @returns IServiceResponse<TreeWrapper>
	 */
	async getTreeByRoot(nodeId: string): Promise<IServiceResponse<TreeWrapper>> {
		const getResponse = await this.nodeCollectionConnection.findNodeById(nodeId)
		if (!getResponse.success) {
			return failureServiceResponse('Node does not exist')
		}
		const root: INode = getResponse.payload
		const toReturn: TreeWrapper = await this.buildTreeHelper(new TreeWrapper(root))
		return successfulServiceResponse(toReturn)
	}

	/**
	 * Method to get nodes with no parent and all their children.
	 * @returns IServiceResponse<TreeWrapper[]>
	 */
	async getRoots(): Promise<IServiceResponse<TreeWrapper[]>> {
		const findRootsResp = await this.nodeCollectionConnection.findRoots()
		if (!findRootsResp.success) {
			return failureServiceResponse(findRootsResp.message)
		}
		const nodeQueue: INode[] = findRootsResp.payload
		const rootsToReturn: TreeWrapper[] = []
		for (const root of nodeQueue) {
			rootsToReturn.push(await this.buildTreeHelper(new TreeWrapper(root)))
		}
		return successfulServiceResponse(rootsToReturn)
	}

	/**
	 * Method to build a tree that represents file structure.
	 * @param rootWrapper - The root of the tree.
	 * @return rootWrapper with the children appended
	 */
	private async buildTreeHelper(rootWrapper: TreeWrapper): Promise<TreeWrapper> {
		const root = rootWrapper.node
		const childrenNodesResp: IServiceResponse<INode[]> =
			await this.nodeCollectionConnection.findNodesById(root.filePath.children)
		if (childrenNodesResp.success) {
			for (const childNode of childrenNodesResp.payload) {
				const childNodeWrapper = await this.buildTreeHelper(new TreeWrapper(childNode))
				rootWrapper.addChild(childNodeWrapper)
			}
		}
		return rootWrapper
	}

	/**
	 * Method to recursively delete node and all its children.
	 * @param rootWrapper The root of the tree.
	 * @returns IServiceResponse<{}>
	 */
	private async recursivelyDeleteTree(
		rootWrapper: TreeWrapper
	): Promise<IServiceResponse<{}>> {
		for (const child of rootWrapper.children) {
			const deleteChildResp = await this.recursivelyDeleteTree(child)
			if (!deleteChildResp.success) {
				return failureServiceResponse(
					'failed to delete node with nodeId: ' + child.node.nodeId
				)
			}
		}
		const deleteResp = await this.nodeCollectionConnection.deleteNode(
			rootWrapper.node.nodeId
		)
		return deleteResp.success
			? successfulServiceResponse({})
			: failureServiceResponse(
				'failed to delete node with nodeId: ' + rootWrapper.node.nodeId
			)
	}

	/**
	 * Method to update a node's and its descendent's filePath.
	 *
	 * @param rootWrapper the root node to update
	 * @param newPath the new path for the root node
	 */
	private async recursivelyUpdatePath(
		rootWrapper: TreeWrapper,
		newPath: string[]
	): Promise<IServiceResponse<{}>> {
		for (const childWrapper of rootWrapper.children) {
			const updatePathResp = await this.recursivelyUpdatePath(
				childWrapper,
				newPath.concat([childWrapper.node.nodeId])
			)
			if (!updatePathResp.success) {
				return failureServiceResponse(updatePathResp.message)
			}
		}
		const updatePathResp = await this.nodeCollectionConnection.updatePath(
			rootWrapper.node.nodeId,
			newPath
		)
		return updatePathResp.success
			? successfulServiceResponse({})
			: failureServiceResponse(
				'failed to update path node with nodeId: ' +
				rootWrapper.node.nodeId +
				', path: ' +
				newPath
			)
	}
}
