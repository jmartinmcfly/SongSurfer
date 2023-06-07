import React, { SetStateAction, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PauseIcon from '../../Utils/Svg/pauseIcon.jsx'
import PlayIcon from '../../Utils/Svg/playIcon.jsx'
import SkipForwardIcon from '../../Utils/Svg/skipForwardIcon.jsx'
import SkipBackIcon from '../../Utils/Svg/skipBackIcon.jsx'
import EmptyHeartIcon from '../../Utils/Svg/emptyHeartIcon.jsx'
import FullHeartIcon from '../../Utils/Svg/fullHeartIcon.jsx'
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
  setRerenderOnLikeTrigger: React.Dispatch<SetStateAction<number>>
  reRenderOnLikeTrigger: number
}

interface track {
  id: string
  name: string
  uri: string
  album: { images: { url: string }[] }
  artists: { name: string; uri: string }[]
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
  const [isLiked, setIsLiked] = useState(false)
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

          // TODO: Check if the track is liked
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

  // load likedState
  useEffect(() => {
    console.log('likedState updating')
    console.log(currentTrack)
    console.log(currentTrack?.id)
    // get isLiked data from spotify
    // TODO this request isn't working, the ids are failing somehow
    const result = axios
      .get('https://api.spotify.com/v1/me/tracks/contains', {
        headers: { Authorization: 'Bearer ' + props.token },
        params: {
          ids: currentTrack?.id,
        },
      })
      .then((response) => {
        console.log('SUCEDSSSSSSSSSSSSSSSSSSSSSSSSWS')
        console.log(response)
        // create new liked dict
        setIsLiked(response.data[0])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [currentTrack, props.reRenderOnLikeTrigger])

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

  // TODO: Like code
  const handleLike = () => {
    axios
      .put(
        'https://api.spotify.com/v1/me/tracks',
        { ids: [currentTrack?.id] },
        { headers: { Authorization: 'Bearer ' + props.token } }
      )
      .then(() => {
        props.setRerenderOnLikeTrigger(props.reRenderOnLikeTrigger + 1)
      })
    setIsLiked(true)
  }

  const handleUnlike = () => {
    axios
      .delete('https://api.spotify.com/v1/me/tracks', {
        data: { ids: [currentTrack?.id] },
        headers: { Authorization: 'Bearer ' + props.token },
      })
      .then(() => {
        props.setRerenderOnLikeTrigger(props.reRenderOnLikeTrigger + 1)
      })
    setIsLiked(false)
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

  const handleTrackRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack !== null) {
      const uri = currentTrack.uri.replace('spotify:track:', '')
      window.open('https://open.spotify.com/track/' + uri)
    }
  }

  const handleArtistRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack !== null) {
      const uri = currentTrack.artists[0].uri.replace('spotify:artist:', '')
      window.open('https://open.spotify.com/artist/' + uri)
    }
  }

  // styles

  const playerDivStyle: React.CSSProperties = {
    display: 'flex',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  }

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: '0',
  }

  const albumImageStyle: React.CSSProperties = {
    display: 'flex',
    height: '60px',
    width: '60px',
    paddingRight: '10px',
  }

  const trackTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }

  const trackTextContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'white',
  }

  const trackNameStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    width: '150px',
    height: '50px',
  }

  const controlStyle: React.CSSProperties = {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }

  const progressStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110%',
  }

  const songProgressStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '12px',
    width: '40px',
  }

  const songDurationStyle: React.CSSProperties = {
    ...songProgressStyle,
  }

  const heartIconStyle: React.CSSProperties = {
    height: '26px',
    width: '26px',
    marginLeft: '10px',
    marginTop: '15px',
    fill: '#ffffff',
  }

  const heartIconWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    right: '65px',
    top: '0px',
  }

  // jsx

  // TODO: add like icon
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

        <div className="trackTextContainer" style={trackTextContainerStyle}>
          <div className={'trackText'} style={trackTextStyle}>
            <div
              className="clickableText"
              style={trackNameStyle}
              onClick={handleTrackRedirect}
            >
              {currentTrack !== null && currentTrack.name}
            </div>

            <div
              className="clickableText"
              style={albumNameStyle}
              onClick={handleArtistRedirect}
            >
              {currentTrack !== null && currentTrack.artists[0].name}
            </div>
          </div>
        </div>
      </div>
      <div className={'control'} style={controlStyle}>
        <div className={'buttons'} style={buttonStyle}>
          <SkipBackIcon className="controlIcon skipBackIcon" onClick={handleSkipBack} />
          {!isPlaying ? (
            <PlayIcon className="controlIcon playIcon" onClick={handlePlayPause} />
          ) : (
            <PauseIcon className="controlIcon pauseIcon" onClick={handlePlayPause} />
          )}

          <SkipForwardIcon
            className="controlIcon skipForwardIcon"
            onClick={handleSkipForward}
          />
        </div>
        <div className="progressStyle" style={progressStyle}>
          <div className="songProgress" style={songProgressStyle}>
            {Math.floor((progress / 1000) % 60) < 10
              ? Math.floor(progress / 1000 / 60) +
                ':' +
                '0' +
                Math.floor((progress / 1000) % 60)
              : Math.floor(progress / 1000 / 60) +
                ':' +
                Math.floor((progress / 1000) % 60)}
          </div>
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
          <div className="songDuration" style={songDurationStyle}>
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
      <div style={heartIconWrapperStyle}>
        {isLiked ? (
          <FullHeartIcon onClick={handleUnlike} style={heartIconStyle} />
        ) : (
          <EmptyHeartIcon onClick={handleLike} style={heartIconStyle} />
        )}
      </div>
    </div>
  )
}
