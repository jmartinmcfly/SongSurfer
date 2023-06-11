import React, { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
} from '../../../types'

interface AuthHandlerProps {
  setAccessToken: React.Dispatch<React.SetStateAction<string>>
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>
  refreshToken: string
}

export const AuthHandler = (props: AuthHandlerProps) => {
  const [code, setCode] = useState('')
  const [firstCall, setFirstCall] = useState(false)
  const location = useLocation()

  const refreshToken = props.refreshToken

  const setAccessToken = props.setAccessToken
  const setRefreshToken = props.setRefreshToken

  // grab the api code from the url
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const codeParam = params.get('code')
    if (codeParam) {
      console.log('found code: ')
      console.log(codeParam)
      setCode(codeParam)
    } else {
      console.log('no code found')
    }
  }, [location.search])

  // get token from spotify. Returns the whole data object from spotify's response.
  const fetchToken = async (): Promise<IServiceResponse<any>> => {
    // TODO: figure out what the client secret is
    try {
      console.log(
        process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET
      )

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        {
          client_id: process.env.REACT_APP_CLIENT_ID,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/main',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(
                process.env.REACT_APP_CLIENT_ID +
                  ':' +
                  process.env.REACT_APP_CLIENT_SECRET
              ).toString('base64'),
          },
        }
      )

      if (response.status === 200) {
        return successfulServiceResponse(response.data)
      } else {
        console.log('failed first token fetch')
        return failureServiceResponse(response.data)
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: 'failed to fetch first token', payload: error }
    }
  }

  // fetch the original auth token
  useEffect(() => {
    if (code != '') {
      // check for a more recent access token in local storage
      if (localStorage.getItem('refreshToken')) {
        // if there is a refresh token, use it to get a new access token. Happens on page reload.
        setRefreshToken(localStorage.getItem('refreshToken') || '')
      } else {
        console.log('first Call!')
        // fetch token on first load after redirect
        setFirstCall(true)
        fetchToken().then((firstToken: IServiceResponse<any>) => {
          if (firstToken.success) {
            console.log('success')
            setAccessToken(firstToken.payload.access_token)
            setRefreshToken(firstToken.payload.refresh_token)
            localStorage.setItem('refreshToken', firstToken.payload.refresh_token)
          } else {
            console.log('error getting auth token ' + firstToken.message)
          }
        })
      }
    }

    // clear interval on unmount
  }, [code, fetchToken, setAccessToken, setRefreshToken])

  // refresh token from spotify. Returns the whole data object from spotify's response.
  const fetchRefreshToken = async (): Promise<IServiceResponse<any>> => {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET
            ).toString('base64'),
        },
      }
    )

    if (response.status === 200) {
      return successfulServiceResponse(response.data)
    } else {
      console.log('refresh token failed')
      return failureServiceResponse(response.data)
    }
  }

  // set a timer for refreshing the token
  useEffect(() => {
    console.log('refresh' + refreshToken)

    // if the refreshToken is already in localStorage, call the api right away
    if (refreshToken !== '') {
      if (!firstCall) {
        setFirstCall(true)
        fetchRefreshToken().then((newToken: IServiceResponse<any>) => {
          if (newToken.success) {
            setAccessToken(newToken.payload.access_token)
          } else {
            console.log('error refreshing auth token ' + newToken.message)
          }
        })
      }

      // refresh token every 10 minutes
      const interval = setInterval(() => {
        fetchRefreshToken().then((newToken: IServiceResponse<any>) => {
          if (newToken.success) {
            setAccessToken(newToken.payload.access_token)
          } else {
            console.log('error refreshing auth token ' + newToken.message)
          }
        })
      }, 10 * 60 * 1000)
      // 15 minutes * 60 seconds * 1000 milliseconds
      return () => clearInterval(interval)
    }
  }, [refreshToken, setAccessToken, firstCall, fetchRefreshToken])

  return <></>
}
