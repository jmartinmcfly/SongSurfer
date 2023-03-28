import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * These helper methods use Axios (https://axios-http.com/docs/intro)
 * to make http requests to the server
 */
export async function http<T>(request: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axios(request)
  return response.data
}

/** The HTTP GET method requests a representation of the specified resource. */
export async function get<T>(url: string): Promise<T> {
  return await http<T>({
    url: url,
    method: 'GET',
  })
}

/** Send data in the body of the HTTP Request */
export async function post<T>(url: string, body: any): Promise<T> {
  return await http<T>({
    url: url,
    method: 'POST',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * The HTTP PUT request method creates a new resource or replaces
 * a representation of the target resource with the request payload.
 */
export async function put<T>(url: string, body: any): Promise<T> {
  return await http<T>({
    url: url,
    method: 'PUT',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** The HTTP DELETE request method deletes the specified resource. */
export async function remove<T>(url: string): Promise<T> {
  return await http<T>({
    url: url,
    method: 'DELETE',
  })
}
