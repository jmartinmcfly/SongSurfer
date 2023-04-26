import React, { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { AuthHandler } from '../AuthHandler/AuthHandler'
import { MusicPlayer } from '../MusicPlayer/MusicPlayer'
import { PlaylistView } from '../PlaylistView/PlaylistView'
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
  const [profileData, setProfileData] = useState<any>(null)

  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const location = useLocation()

  // fetch profile data once access token is set
  useEffect(() => {
    if (accessToken != '') {
      fetchProfileData().then((data) => {
        setProfileData(data)
      })
    }
  }, [accessToken])

  // fetch playlist data once profile data is set
  useEffect(() => {
    if (profileData) {
      fetchPlaylists().then((data) => {
        // data.items are simplifiedPlaylistObjects
        const playlists = data.items
        let found: boolean = false
        for (const playlist of playlists) {
          if (playlist.name == 'DJ-GPT') {
            found = true

            // fetch full playlist object
            axios
              .get('https://api.spotify.com/v1/playlists/' + playlist.id, {
                headers: { Authorization: 'Bearer ' + accessToken },
              })
              .then((resp) => {
                //TODO: remove console
                console.log('setting curplay')
                console.log(playlist)
                setCurrentPlaylist(resp.data)
              })
          }
        }
        // if no playlist found, create one and set currentPlaylist to it
        if (!found) {
          axios
            .post(
              'https://api.spotify.com/v1/users/' + profileData.id + '/playlists',
              {
                name: 'DJ-GPT',
                description: 'A playlist generated by DJ-GPT',
                public: true,
              },
              {
                headers: { Authorization: 'Bearer ' + accessToken },
              }
            )
            .then((resp) => {
              setCurrentPlaylist(resp.data)
            })
        }
      })
    }
  }, [profileData])

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

  async function fetchProfileData(): Promise<any> {
    console.log('the token for profile is: ')
    console.log(accessToken)
    const result = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken },
    })
    return await result.data
  }

  async function fetchPlaylists(): Promise<any> {
    const result = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: 'Bearer ' + accessToken },
    })
    return await result.data
  }

  const basicStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }

  return (
    <div style={basicStyle}>
      <AuthHandler
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        refreshToken={refreshToken}
      />
      {profileData && 'welcome ' + profileData.display_name}
      <MusicPlayer
        setDeviceId={setDeviceId}
        deviceId={deviceId}
        currentTrack={''}
        tracks={{}}
        token={accessToken}
        setSpotifyPlayer={setSpotifyPlayer}
      />
      <div style={{ marginBottom: '30px' }}></div>
      {spotifyPlayer && (
        <PlaylistView
          token={accessToken}
          currentPlaylist={currentPlaylist}
          handlePlayPause={spotifyPlayer.togglePlay()}
        />
      )}
    </div>
  )
}
