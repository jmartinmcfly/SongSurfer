import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EmptyHeartIcon from '../Svg/emptyHeartIcon'
import FullHeartIcon from '../Svg/fullHeartIcon'
import PlayIcon from '../Svg/playIcon'
import PauseIcon from '../Svg/pauseIcon'

// TODO: Trackview needs to know if its currently playing
interface trackViewProps {
  token: string
  trackNumber: number
  albumPhotoUrl: string
  trackName: string
  artistName: string
  albumName: string
  isLiked: boolean
  trackLength: number
  trackUri: string
  player: any
  deviceId: string
  currentPlaylist: any
  isCurrentTrack: boolean
  isPlaying: boolean
}

// TODO: Fix track styling
// styles
const flexRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}

const trackContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
}

const trackTextContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const albumPhotoStyle = {
  height: '35px',
  width: '35px',
  marginRight: '10px',
}

const heartIconStyle: React.CSSProperties = {
  height: '22px',
  width: '22px',
}

const playPauseIconStyle = heartIconStyle

const trackInfoContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginLeft: '90px',
}

const trackNameStyle: React.CSSProperties = {
  display: 'flex',
  fontSize: '16px',
  marginBottom: '2px',
}

const artistNameStyle: React.CSSProperties = {
  display: 'flex',
  fontSize: '12px',
}

const albumNameStyle: React.CSSProperties = {
  marginLeft: '7px',
}

const heartIconContainerStyle: React.CSSProperties = {
  marginRight: '20px',
}

const separatorStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'black',
  margin: '16px 0px 16px 0px',
}

// TODO: add a click handler to the heart icons
export const TrackView = (props: trackViewProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [leftmostIcon, setLeftmostIcon] = useState<JSX.Element>(
    <div>{props.trackNumber}</div>
  )
  // hooks

  // determine how to handle play / pause / number for render
  useEffect(() => {
    console.log('current track: ' + props.trackName)
    console.log('is current track: ' + props.isCurrentTrack)
    if (props.isCurrentTrack) {
      if (props.isPlaying) {
        setLeftmostIcon(
          <PauseIcon style={playPauseIconStyle} onClick={handleTogglePlay} />
        )
      } else {
        setLeftmostIcon(
          <PlayIcon style={playPauseIconStyle} onClick={handleTogglePlay} />
        )
      }
    } else {
      if (isHovering) {
        setLeftmostIcon(<PlayIcon style={playPauseIconStyle} onClick={handleStartPlay} />)
      } else {
        setLeftmostIcon(<div>{props.trackNumber}</div>)
      }
    }
  }, [isHovering, props.isCurrentTrack, props.isPlaying])

  // event handlers

  const handleMouseEnter = () => {
    setIsHovering(true)
  }
  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleStartPlay = () => {
    // TODO: request maybe malformed
    axios.put(
      'https://api.spotify.com/v1/me/player/play',
      {
        device_id: props.deviceId,
        context_uri: props.currentPlaylist.uri,
        offset: { uri: props.trackUri },
      },
      { headers: { Authorization: 'Bearer ' + props.token } }
    )
  }

  const handleTogglePlay = () => {
    props.player.togglePlay()
  }
  // TODO: NEXT SESSION START HERE
  // TODO on hover, show play icon with a click handler that playPauses the song
  // you may need to pass a different prop to this component to handle the playPause if not playing

  // TODO enliven like button
  return (
    <div
      className={'trackContainerWrapper'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={'trackContainer'} style={trackContainerStyle}>
        <div className={'trackNumber'}>{leftmostIcon}</div>
        <div className={'trackInfoContainer'} style={trackInfoContainerStyle}>
          <img src={props.albumPhotoUrl} style={albumPhotoStyle} />
          <div className={'trackTextContainer'} style={trackTextContainerStyle}>
            <div className={'trackName'} style={trackNameStyle}>
              {props.trackName}
            </div>
            <div className={'artistName'} style={artistNameStyle}>
              {props.artistName}
            </div>
          </div>
        </div>
        <div className={'albumName'} style={albumNameStyle}>
          {props.albumName}
        </div>
        <div className={'trackLength'} style={flexRowStyle}>
          <div className={'heartIconContainer'} style={heartIconContainerStyle}>
            {props.isLiked ? (
              <FullHeartIcon style={heartIconStyle} />
            ) : (
              <EmptyHeartIcon style={heartIconStyle} />
            )}
          </div>
          {Math.floor((props.trackLength / 1000) % 60) < 10
            ? Math.floor(props.trackLength / 1000 / 60) +
              ':' +
              '0' +
              Math.floor((props.trackLength / 1000) % 60)
            : Math.floor(props.trackLength / 1000 / 60) +
              ':' +
              Math.floor((props.trackLength / 1000) % 60)}
        </div>
      </div>
      <div style={separatorStyle}></div>
    </div>
  )
}
