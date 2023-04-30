import React, { SetStateAction, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PauseIcon from '../../Utils/Svg/pauseIcon.jsx'
import PlayIcon from '../../Utils/Svg/playIcon.jsx'
import SkipForwardIcon from '../../Utils/Svg/skipForwardIcon.jsx'
import SkipBackIcon from '../../Utils/Svg/skipBackIcon.jsx'
import './MusicPlayer.scss'

// interfaces
interface MusicPlayerProps {
  currentTrack: any
  tracks: any
  token: string
  setSpotifyPlayer: React.Dispatch<SetStateAction<any>>
  // setter for device id from parent
  setDeviceId: React.Dispatch<SetStateAction<string>>
  deviceId: string
}

interface track {
  name: string
  album: { images: { url: string }[] }
  artists: { name: string }[]
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

// TODO: Progress bar with seeking

/*
  This component renders a music player interface using Spotify Player.
  It supports playing, pausing, skipping, and seeking.
  This component encapsulates all Web Playback SDK Logic.

  NOTE: Currently does not handle if the user automatically "forgets" the 
  webSDK device on spotify during a session. In that case, reload solves
  the problem.
*/
export const MusicPlayer = (props: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState<track | null>(null)
  const [player, setPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [active, setActive] = useState(false)

  // progress bar
  const [tempProgress, setTempProgress] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // initialize player script and create a player
  useEffect(() => {
    if (props.token !== '' && player === null) {
      // load spotify player
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      // create player
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: (cb: (token: string) => void) => {
            cb(props.token)
          },
        })

        // TODO: factor out player state into props
        setPlayer(player)
        props.setSpotifyPlayer(player)

        // Add listeners
        player.addListener('ready', ({ device_id }: any) => {
          // player.togglePlay()
          props.setDeviceId(device_id)
          console.log('Ready with Device ID', device_id)
        })

        player.addListener('not_ready', ({ device_id }: any) => {
          console.log('Device ID has gone offline', device_id)
        })

        player.addListener('player_state_changed', (state: any) => {
          if (!state) {
            return
          }

          setCurrentTrack(state.track_window.current_track)
          setIsPlaying(!state.paused)
          console.log(state.track_window.current_track)

          // this happens when we switch the player to a different

          if (state.track_window.current_track == null) {
            setActive(false)
          } else {
            setActive(true)
          }
        })

        // connect the player to spotify
        player.connect().then((success: boolean) => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!')
          }
        })
      }
    }
  }, [props.token])

  // progress tracking
  useEffect(() => {
    const progressInterval = setInterval(updateProgress, 1000) // Update progress every second
    return () => clearInterval(progressInterval)
  }, [player])

  // queries the player SDK to update song progress
  const updateProgress = () => {
    if (player) {
      player.getCurrentState().then((state: any) => {
        if (state) {
          const { position, duration } = state
          setProgress(position)
          setDuration(duration)
        }
      })
    }
  }

  // event handlers

  const handleSkipForward = () => {
    if (player) {
      player.nextTrack()
      setProgress(0)
    }
  }

  // TODO: eventually figure out why I had to do this with the if instead of just player.previousTrack()

  const handleSkipBack = () => {
    if (player) {
      if (progress / 1000 < 3) {
        player.previousTrack()
        setProgress(0)
      } else {
        player.seek(0)
        setProgress(0)
      }
    }
  }

  const handlePlayPause = () => {
    if (player) {
      // if player isn't the active player, set it to the active player
      if (!active) {
        // api call to set device
        const result = axios
          .put(
            'https://api.spotify.com/v1/me/player',
            {
              device_ids: [props.deviceId],
            },
            {
              headers: { Authorization: 'Bearer ' + props.token },
            }
          )
          .then((res) => {
            setActive(true)
            // TODO: set to play not toggle - seems to be working as is though?
            player.togglePlay()
            setIsPlaying(!isPlaying)
          })
      } else {
        player.togglePlay()
        setIsPlaying(!isPlaying)
      }
    }
  }

  const handleSeekMouseDown = () => {
    setIsDragging(true)
  }

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDragging) {
      setTempProgress(parseFloat(event.target.value))
    }
  }

  const handleSeekMouseUp = () => {
    setIsDragging(false)
    setProgress(tempProgress)
    if (player) {
      player.seek(tempProgress)
    }
    // Seek the player to the new progress value here.
  }

  // styles

  const playerDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
  }

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
  }

  const albumImageStyle: React.CSSProperties = {
    display: 'flex',
    height: '50px',
    width: '50px',
    paddingRight: '10px',
  }

  const trackTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }

  const trackNameStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: '14px',
  }

  const albumNameStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: '11px',
  }

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px',
    borderColor: 'black',
    width: '200px',
    height: '50px',
  }

  const controlStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const progressStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const iconPaddingStyle = {
    padding: '10px',
  }

  // jsx

  return (
    <div className={'playerDiv'} style={playerDivStyle}>
      <div className={'track'} style={trackStyle}>
        <div className={'albumImage'} style={albumImageStyle}>
          {currentTrack !== null && (
            <img
              src={currentTrack.album.images[0].url}
              className="now-playing__cover"
              alt="Album Cover"
            />
          )}
        </div>

        <div className={'trackText'} style={trackTextStyle}>
          <div style={trackNameStyle}>{currentTrack !== null && currentTrack.name}</div>

          <div style={albumNameStyle}>
            {currentTrack !== null && currentTrack.artists[0].name}
          </div>
        </div>
      </div>
      <div className={'control'} style={controlStyle}>
        <div className={'buttons'} style={buttonStyle}>
          <SkipBackIcon
            className="skipBackIcon"
            style={iconPaddingStyle}
            onClick={handleSkipBack}
          />
          {!isPlaying ? (
            <PlayIcon
              className="playIcon"
              style={iconPaddingStyle}
              onClick={handlePlayPause}
            />
          ) : (
            <PauseIcon
              className="playIcon"
              style={iconPaddingStyle}
              onClick={handlePlayPause}
            />
          )}
          <SkipForwardIcon
            className="skipForwardIcon"
            style={iconPaddingStyle}
            onClick={handleSkipForward}
          />
        </div>
        <div style={progressStyle}>
          {Math.floor((progress / 1000) % 60) < 10
            ? Math.floor(progress / 1000 / 60) +
              ':' +
              '0' +
              Math.floor((progress / 1000) % 60)
            : Math.floor(progress / 1000 / 60) + ':' + Math.floor((progress / 1000) % 60)}
          {isDragging ? (
            <input
              type="range"
              min="0"
              max={duration}
              value={tempProgress}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onChange={handleSeekChange}
              className="progress-bar"
            />
          ) : (
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onChange={handleSeekChange}
              className="progress-bar"
            />
          )}
          {Math.floor(((duration - progress) / 1000) % 60) < 10
            ? Math.floor((duration - progress) / 1000 / 60) +
              ':' +
              '0' +
              Math.floor(((duration - progress) / 1000) % 60)
            : Math.floor((duration - progress) / 1000 / 60) +
              ':' +
              Math.floor(((duration - progress) / 1000) % 60)}
        </div>
      </div>
    </div>
  )
}
