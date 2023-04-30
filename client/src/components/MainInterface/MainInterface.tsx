import React, { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { AuthHandler } from '../Auth/AuthHandler/AuthHandler'
import { MusicPlayer } from '../Spotify/MusicPlayer/MusicPlayer'
import { PlaylistView } from '../Spotify/PlaylistView/PlaylistView'
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
} from '../../types'
import { ChatVisualizer } from '../Chat/ChatVisualizer/ChatVisualizer'
import { ChatInput } from '../Chat/ChatInput/ChatInput'

interface MainInterfaceProps {
  state: string
}

enum Role {
  User = 'user',
  Assistant = 'assistant',
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

  // TODO: implement chatHistory logic
  const [fullChatHistory, setFullChatHistory] = useState<
    { role: Role; content: string }[]
  >([])
  const [truncatedChatHistory, setTruncatedChatHistory] = useState<
    { role: Role; content: string }[]
  >([])

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

  // API calls:

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

  // Event handlers:

  // TODO: submit logic
  const onChatSubmit = (message: string) => {
    // Token manager
    const newMessage = trimTokens(message, truncatedChatHistory)

    // append message prelude
    const messagePrelude =
      'System message: Please pay extra attention to "actionType". When iterating on a playlist, use "add" to add songs, and "remove" to remove songs. Only use "replace" when starting a totally new playlist.\nUser: '
    const finalMessage = messagePrelude + newMessage

    // TODO: call openai chat api on finalMessage

    // TODO: .then() process the response
    // TODO: update fullChatHistory and truncatedChatHistory
    // TODO: call spotify api to update playlist
  }

  // TODO
  const trimTokens = (
    message: string,
    truncChatHistory: { role: Role; content: string }[]
  ): string => {
    return ''
  }

  // Styles:

  const basicStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }

  const chatDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  }

  // TODO: flesh out chat components.
  // TODO: Fix user image url
  return (
    <div style={basicStyle}>
      <AuthHandler
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        refreshToken={refreshToken}
      />
      {profileData && 'welcome ' + profileData.display_name}
      <div className={'chatDiv'} style={chatDivStyle}>
        <ChatVisualizer
          chatHistory={fullChatHistory}
          userImageUrl={
            'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'
          }
        />
        <ChatInput onSubmit={onChatSubmit} />
      </div>
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
          player={spotifyPlayer}
          deviceId={deviceId}
        />
      )}
    </div>
  )
}
