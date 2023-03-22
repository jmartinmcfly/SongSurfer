import express, { Request, Response, Router } from 'express'
import { rest } from 'lodash'
import { MongoClient } from 'mongodb'
import {
  INode,
  INodeProperty,
  TreeWrapper,
  IServiceResponse,
  isINode,
  failureServiceResponse,
} from '../types'
import { NodeGateway } from './NodeGateway'
const bodyJsonParser = require('body-parser').json()

// eslint-disable-next-line new-cap
export const MyRouter = express.Router()

/**
 * NodeRouter uses MyRouter (an express router) to define responses
 * for specific HTTP requests at routes starting with '/node'.
 * E.g. a post request to '/node/create' would create a node.
 * The NodeRouter contains a NodeGateway so that when an HTTP request
 * is received, the NodeRouter can call specific methods on NodeGateway
 * to trigger the appropriate response. See server/src/app.ts to see how
 * we set up NodeRouter - you don't need to know the details of this just yet.
 */
export class NodeRouter {
  nodeGateway: NodeGateway

  constructor(mongoClient: MongoClient) {
    this.nodeGateway = new NodeGateway(mongoClient)

    /**
     * Request to create node
     * @param req request object coming from client
     * @param res response object to send to client
     *
     * TODO (Lab 1):
     */

    MyRouter.post('/create', async (req: Request, res: Response) => {
      try { 
        const node = req.body.node
        console.log(node)
        if (!isINode(node)) {
          // 400 Bad Request
          res.status(400).send('node INode')
        } else {
          // 200 OK
          const response = await this.nodeGateway.createNode(node)
          res.status(200).send(response)
        }
      } catch(e) {
        //500 Internal Server Error
        res.status(500).send(e.message)
      }
      
    })

    /**
     * Request to retrieve node by nodeId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.get('/get/:nodeId', async (req: Request, res: Response) => {
      try {
        const nodeId = req.params.nodeId
        const response: IServiceResponse<INode> = await this.nodeGateway.getNodeById(
          nodeId
        )
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to update the node with the given nodeId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.put('/:nodeId', bodyJsonParser, async (req: Request, res: Response) => {
      try {
        const nodeId = req.params.nodeId
        const toUpdate: INodeProperty[] = req.body.data
        const response = await this.nodeGateway.updateNode(nodeId, toUpdate)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to move the node with the given nodeId to the given parentId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.put(
      '/move/:nodeId/:newParentId',
      bodyJsonParser,
      async (req: Request, res: Response) => {
        try {
          const nodeId = req.params.nodeId
          const newParentId = req.params.newParentId
          const response = await this.nodeGateway.moveNode(nodeId, newParentId)
          res.status(200).send(response)
        } catch (e) {
          res.status(500).send(e.message)
        }
      }
    )

    /**
     * Request to delete the node with the given nodeId
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.delete('/:nodeId', async (req: Request, res: Response) => {
      try {
        const nodeId = req.params.nodeId
        const response = await this.nodeGateway.deleteNode(nodeId)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to retrieve node with all its children
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.get('/root/:nodeId', async (req: Request, res: Response) => {
      try {
        const nodeId = req.params.nodeId
        const response: IServiceResponse<TreeWrapper> =
          await this.nodeGateway.getTreeByRoot(nodeId)
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to retrieve all nodes that does not have parent
     * @param req request object coming from client
     * @param res response object to send to client
     */
    MyRouter.get('/roots', async (req: Request, res: Response) => {
      try {
        const response: IServiceResponse<TreeWrapper[]> =
          await this.nodeGateway.getRoots()
        res.status(200).send(response)
      } catch (e) {
        res.status(500).send(e.message)
      }
    })
  }

  /**
   * @returns NodeRouter class
   */
  getExpressRouter = (): Router => {
    return MyRouter
  }
}
