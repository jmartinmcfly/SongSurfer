import React, { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import uniqid from 'uniqid'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { get, post, put, remove } from '../../BackendGateway/request'
import { AuthRedirect } from '../AuthRedirect/AuthRedirect'
import {} from '../../types'
import './MainView.scss'
import { MainInterface } from '../MainInterface/MainInterface'

export const MainView = () => {
  // [1] useState hooks
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState('')

  // [2] Constant variables
  /** Url for react-router-dom responsive URL */
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI = 'http://localhost:3000/main'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const scope = 'user-read-private user-read-email'
  // [3] useEffect hooks
  useEffect(() => {
    const newState = uniqid()
    setState(newState)
  })

  // [4] Button handlers
  const example = async (node: any) => {}

  // [5] Helper functions
  /** Update our frontend root nodes from the DB */
  const helperExample = async () => {}

  /**
   * [6] JSX component
   * // TODO: Test getting info: Get profile name and display it
   */
  return (
    <div className="App">
      {'Hello World'}
      {state != '' && (
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRedirect
                authEndpoint={AUTH_ENDPOINT}
                clientId={CLIENT_ID}
                redirectUri={REDIRECT_URI}
                scope={scope}
                state={state}
              />
            }
          />
          <Route path="/main" element={<MainInterface state={state} />} />
          <Route element={<div> {'Not Found'} </div>} />
        </Routes>
      )}
    </div>
  )
}
