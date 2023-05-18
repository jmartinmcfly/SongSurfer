import express, { Request, Response, Router } from 'express'
const bodyJsonParser = require('body-parser').json()

// eslint-disable-next-line new-cap
export const MyRouter = express.Router()

export class OpenAiRouter {
  constructor() {
    /**
     * Request to create node
     * @param req request object coming from client
     * @param res response object to send to client
     *
     * TODO (Lab 1):
     */
    MyRouter.get('/trimtokens', async (req: Request, res: Response) => {
      try {
        // TODO
        // 400 bad request
        // 200 ok
        const response = await this.trimTokens(req.query.tokens)
        res.status(200).send(response)
      } catch (e) {
        // 500 internal server error
        res.status(500).send(e.message)
      }
    })
  }
}
