export interface IServiceResponse<T> {
  success: boolean
  message: string
  payload: T | null
}

export function successfulServiceResponse<T>(payload: T): IServiceResponse<T> {
  return {
    success: true,
    message: '',
    payload: payload,
  }
}

export function failureServiceResponse<T>(message: string): IServiceResponse<T> {
  return {
    success: false,
    message: message,
    payload: null,
  }
}

export function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
  return (
    sr.success !== undefined &&
    typeof sr.success === 'boolean' &&
    sr.message !== undefined &&
    typeof sr.message === 'string' &&
    sr.payload !== undefined
  )
}
