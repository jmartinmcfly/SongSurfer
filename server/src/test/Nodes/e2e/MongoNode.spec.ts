import { MongoClient } from 'mongodb'
import { NodeGateway } from '../../../nodes'
import {
  INode,
  IServiceResponse,
  makeIFilePath,
  makeINodeProperty,
  NodeType,
} from '../../../types'
import uniqid from 'uniqid'

jest.setTimeout(50000)

describe('E2E Test: Node CRUD', () => {
  let mongoClient: MongoClient
  let nodeGateway: NodeGateway
  const uri: string =
    'mongodb+srv://student:cs1951v@cs1951v-cluster.tjluq.mongodb.net/cs1951v-database?retryWrites=true&w=majority'
  let collectionName: string

  function generateNodeId(type: NodeType) {
    return uniqid(type + '.')
  }

  const testNodeId = generateNodeId('text')
  const testNode: INode = {
    nodeId: testNodeId,
    title: 'test.title',
    filePath: makeIFilePath([testNodeId]),
    content: 'test.content',
    type: 'text',
  }

  beforeAll(async () => {
    collectionName =
      'test-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    nodeGateway = new NodeGateway(mongoClient, collectionName)
    await mongoClient.connect()

    const getResponse = await nodeGateway.getNodeById(testNode.nodeId)
    expect(getResponse.success).toBeFalsy()
  })

  afterAll(async () => {
    const getResponse = await nodeGateway.getNodeById(testNode.nodeId)
    expect(getResponse.success).toBeFalsy()
    await mongoClient.db().collection(collectionName).drop()
    await mongoClient.close()
  })

  test('creates node', async () => {
    const response = await nodeGateway.createNode(testNode)
    expect(response.success).toBeTruthy()
  })

  test('retrieves node', async () => {
    const response = await nodeGateway.getNodeById(testNode.nodeId)
    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toEqual(testNode.nodeId)
    expect(response.payload.content).toEqual(testNode.content)
  })

  test('updates node', async () => {
    const updateResp = await nodeGateway.updateNode(testNodeId, [
      makeINodeProperty('content', 'new content'),
      makeINodeProperty('title', 'new title'),
    ])
    expect(updateResp.success).toBeTruthy()
  })

  test('deletes node', async () => {
    const deleteResponse = await nodeGateway.deleteNode(testNode.nodeId)
    expect(deleteResponse.success).toBeTruthy()

    const getResponse = await nodeGateway.getNodeById(testNode.nodeId)
    expect(getResponse.success).toBeFalsy()
  })
})

describe('E2E Test: File Structure Validity', () => {
  let mongoClient: MongoClient
  let nodeGateway: NodeGateway
  const uri: string =
    'mongodb+srv://student:cs1951v@cs1951v-cluster.tjluq.mongodb.net/cs1951v-database?retryWrites=true&w=majority'
  let collectionName: string

  function generateNodeId(type: NodeType) {
    return uniqid(type + '.')
  }

  const testFolderNodeId = generateNodeId('folder')
  const testFolder2NodeId = generateNodeId('folder')
  const testNodeId = generateNodeId('text')
  const testNestedNodeId = generateNodeId('text')

  const testFolder: INode = {
    nodeId: testFolderNodeId,
    title: 'test.title.testFolder',
    filePath: makeIFilePath([testFolderNodeId]),
    content: 'test.content.testFolder',
    type: 'folder',
  }

  const testFolder2: INode = {
    nodeId: testFolder2NodeId,
    title: 'test.title.testFolder2',
    filePath: makeIFilePath([testFolderNodeId, testFolder2NodeId]),
    content: 'test.content.testFolder2',
    type: 'folder',
  }

  const testNode: INode = {
    nodeId: testNodeId,
    title: 'test.title.testNode',
    filePath: makeIFilePath([testFolderNodeId, testNodeId]),
    content: 'test.content.testNode',
    type: 'text',
  }

  const testNestedNode: INode = {
    nodeId: testNestedNodeId,
    title: 'test.title.testNestedNode',
    filePath: makeIFilePath([testFolderNodeId, testFolder2NodeId, testNestedNodeId]),
    content: 'test.content.testNestedNode',
    type: 'text',
  }

  beforeAll(async () => {
    collectionName =
      'test-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    nodeGateway = new NodeGateway(mongoClient, collectionName)
    await mongoClient.connect()

    // testing file structure:
    // testFolder
    //   | - testNode
    //   | - testFolder2
    //      | - testNestedNode

    // create folder should be successful
    await nodeGateway.createNode(testFolder)
    await nodeGateway.createNode(testFolder2)
    await nodeGateway.createNode(testNode)
    await nodeGateway.createNode(testNestedNode)

    // get should be successful and contain new folder
    const getResponse = await nodeGateway.getNodeById(testFolder.nodeId)
    expect(getResponse.success).toBeTruthy()

    const getResponse2 = await nodeGateway.getNodeById(testFolder2.nodeId)
    expect(getResponse2.success).toBeTruthy()

    const getResponse3 = await nodeGateway.getNodeById(testNode.nodeId)
    expect(getResponse3.success).toBeTruthy()

    const getResponse4 = await nodeGateway.getNodeById(testNestedNode.nodeId)
    expect(getResponse4.success).toBeTruthy()
  })

  afterAll(async () => {
    const deleteResponse = await nodeGateway.deleteNode(testNestedNode.nodeId)
    expect(deleteResponse.success).toBeTruthy()

    const deleteResponse1 = await nodeGateway.deleteNode(testFolder2.nodeId)
    expect(deleteResponse1.success).toBeTruthy()

    const deleteResponse2 = await nodeGateway.deleteNode(testFolder.nodeId)
    expect(deleteResponse2.success).toBeTruthy()

    // get should be successful and contain new folder
    const getResponse = await nodeGateway.getNodeById(testNestedNode.nodeId)
    expect(getResponse.success).toBeFalsy()

    const getResponse1 = await nodeGateway.getNodeById(testFolder2.nodeId)
    expect(getResponse1.success).toBeFalsy()

    const getResponse2 = await nodeGateway.getNodeById(testFolder.nodeId)
    expect(getResponse2.success).toBeFalsy()

    const getResponse3 = await nodeGateway.getNodeById(testNode.nodeId)
    expect(getResponse3.success).toBeFalsy()
    await mongoClient.db().collection(collectionName).drop()
    await mongoClient.close()
  })

  test('gets correct file tree', async () => {
    const response: IServiceResponse<INode> = await nodeGateway.getNodeById(
      testFolder.nodeId
    )

    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toEqual(testFolder.nodeId)
    expect(response.payload.filePath.children.length).toEqual(2)

    const response2: IServiceResponse<INode> = await nodeGateway.getNodeById(
      testFolder2.nodeId
    )
    expect(response2.success).toBeTruthy()
    expect(response2.payload.nodeId).toEqual(testFolder2.nodeId)
    expect(response2.payload.filePath.children.length).toEqual(1)

    const response3: IServiceResponse<INode> = await nodeGateway.getNodeById(
      testNode.nodeId
    )
    expect(response3.success).toBeTruthy()
    expect(response3.payload.nodeId).toEqual(testNode.nodeId)
    expect(response3.payload.filePath.children.length).toEqual(0)
  })

  test('correctly moves folder in tree', async () => {
    // get should be successful and contain new folder
    const getResponse1 = await nodeGateway.getNodeById(testFolder2.nodeId)
    expect(getResponse1.success).toBeTruthy()
    expect(getResponse1.payload.filePath.children.length).toEqual(1)
    expect(getResponse1.payload.filePath.children[0]).toEqual(testNestedNode.nodeId)

    const moveResponse = await nodeGateway.moveNode(
      testNestedNode.nodeId,
      testFolder.nodeId
    )

    expect(moveResponse.success).toBeTruthy()

    // get should be successful and contain new folder
    const getResponse2 = await nodeGateway.getNodeById(testFolder.nodeId)
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.filePath.children.length).toEqual(3)
  })
})
