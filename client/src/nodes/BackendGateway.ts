import { failureServiceResponse, IServiceResponse } from '../types'
import { get, post, put, remove } from './request'

/** In development mode (locally) the server is at localhost:5000*/
let baseEndpoint = 'http://localhost:5000'

if (process.env.REACT_APP_BACKEND_ENV === 'production') {
  /** TODO [Deployment]: Update with your heroku backend URL*/
  baseEndpoint = ''
}

/** This is the path to the mongo collection */
// TODO:
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
const BackendGateway = {
  /**
   * createNode
   *
   * TODO: (Lab 1)
   * 1. Try to submit a POST request containing a URL and body
   * 2. Catch exceptions and return a failureServiceResponse if it is unsuccessful
   * //TODO: Implement
   *
   * @param node
   * @returns
   */
  createExample: async (node: any): Promise<IServiceResponse<any>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/create'
      const body: any = { node: node }
      return await post<IServiceResponse<any>>(url, body)
    } catch (e) {
      return failureServiceResponse('[createExample] Unable to access backend')
    }
  },
  /**
   * getExample
   * //TODO: Implement
   *
   * @param exampleId
   * @returns
   */
  getExample: async (exampleId: string): Promise<IServiceResponse<any>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/get/' + exampleId
      return await get<IServiceResponse<any>>(url)
    } catch (exception) {
      return failureServiceResponse('[getExample] Unable to access backend')
    }
  },
  /**
   * deleteExample
   * //TODO: Implement
   *
   * @param exampleId
   * @returns
   */
  deleteExample: async (exampleId: string): Promise<IServiceResponse<{}>> => {
    try {
      const url: string = baseEndpoint + servicePath + '/' + exampleId
      return await remove<IServiceResponse<any>>(url)
    } catch (exception) {
      return failureServiceResponse('[deleteExample] Unable to access backend')
    }
  },
  /**
   *
   * @param example
   * @returns
   */
  updateExample: async (example: any): Promise<IServiceResponse<any>> => {
    try {
      return await put<IServiceResponse<any>>(baseEndpoint + servicePath, {
        example: example,
      })
    } catch (exception) {
      return failureServiceResponse('[updateExample] Unable to access backend')
    }
  },
}

export default BackendGateway
