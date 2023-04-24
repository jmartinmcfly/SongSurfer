import React, { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { AuthHandler } from '../AuthHandler/AuthHandler'
import { MusicPlayer } from '../MusicPlayer/MusicPlayer'
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
  const [profileData, setProfileData] = useState<any>({})
  const [deviceId, setDeviceId] = useState<string>('')
  const location = useLocation()

  // fetch profile data
  useEffect(() => {
    if (accessToken != '') {
      fetchProfileData(accessToken).then((data) => {
        setProfileData(data)
      })
    }
  }, [accessToken])

  useEffect(() => {
    if (deviceId != '' && accessToken != '') {
      // api call to set device
      const result = axios.put(
        'https://api.spotify.com/v1/me/player',
        {
          device_ids: [deviceId],
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )
    }
  }, [deviceId])

  // TODO: Grab and display profile data. Testing that API credentials work.
  async function fetchProfileData(token: string): Promise<any> {
    console.log('the token for profile is: ')
    console.log(token)
    const result = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken },
    })
    return await result.data
  }

  const basicStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <div style={basicStyle}>
      <AuthHandler
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        refreshToken={refreshToken}
      />
      {Object.keys(profileData).length !== 0 && 'welcome ' + profileData.display_name}
      <MusicPlayer
        setDeviceId={setDeviceId}
        deviceId={deviceId}
        currentTrack={''}
        tracks={{}}
        token={accessToken}
      />
    </div>
  )
}
