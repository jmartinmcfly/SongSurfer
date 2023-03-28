import React, { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import uniqid from 'uniqid'
import { useLocation } from 'react-router-dom'
import { get, post, put, remove } from '../../BackendGateway/request'
import {} from '../../types'
import './MainView.scss'

export const MainView = () => {
  // [1] useState hooks
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState('')

  // [2] Constant variables
  /** Url for react-router-dom responsive URL */
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI = 'http://localhost:3000'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'
  const scope = 'user-read-private user-read-email'
  // [3] useEffect hooks
  useEffect(() => {
    const newState = uniqid()
    setState(newState)

    // TODO: Move to routes
    axios.get(AUTH_ENDPOINT, {
      params: {
        client_id: CLIENT_ID,
        response_type: 'code',
        state: newState,
        redirect_uri: REDIRECT_URI,
        scope: scope,
      },
    })
  }, [])

  // [4] Button handlers
  const example = async (node: any) => {}

  // [5] Helper functions
  /** Update our frontend root nodes from the DB */
  const helperExample = async () => {}

  /**
   * [6] JSX component
   * // TODO: Two routes: Login, and the MainView. Login autoredirects to spotify -> MainView
   * // TODO: Test getting info: Get profile name and display it
   */
  return <div className="App"></div>
}
