import express from 'express'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { NodeRouter } from './nodes/NodeRouter'
import { OpenAiRouter } from './openai/OpenAiRouter'
import cors from 'cors' // cors is a package that polices cross-origin requests
import { MongoClient } from 'mongodb'

dotenv.config()
const PORT = process.env.PORT

const app = express()

// start the express web server listening on 5000
app.listen(PORT, () => {
  console.log('Server started on port', PORT)
})

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

const uri = process.env.DB_URI
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoClient.connect()
const myNodeRouter = new NodeRouter(mongoClient)
app.use('/node', myNodeRouter.getExpressRouter())

app.use('/openai', myNodeRouter.getExpressRouter())

app.get('*', (req: Request, res: Response) => {
  res.send('MyHypermedia Backend Service')
})
