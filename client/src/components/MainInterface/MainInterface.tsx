import React, { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { AuthHandler } from '../AuthHandler/AuthHandler'
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
} from '../../types'

interface MainInterfaceProps {
  state: string
}

// TODO: Get an auth token and display profile data
export const MainInterface = (props: MainInterfaceProps) => {
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const location = useLocation()

  // TODO: Grab and dipslay profile data. Testing that API credentials work.
  return (
    <div>
      <AuthHandler
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        refreshToken={refreshToken}
      />
      {'hi' + accessToken}{' '}
    </div>
  )
}
