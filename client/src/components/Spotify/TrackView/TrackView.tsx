import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EmptyHeartIcon from '../../Utils/Svg/emptyHeartIcon'
import FullHeartIcon from '../../Utils/Svg/fullHeartIcon'
import PlayIcon from '../../Utils/Svg/playIcon'
import PauseIcon from '../../Utils/Svg/pauseIcon'
import { kMaxLength } from 'buffer'

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
  trackId: string
  player: any
  deviceId: string
  currentPlaylist: any
  isCurrentTrack: boolean
  isPlaying: boolean
}

// TODO: Fix track styling

// TODO: add a click handler to the heart icons
export const TrackView = (props: trackViewProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [leftmostIcon, setLeftmostIcon] = useState<JSX.Element>(
    <div>{props.trackNumber}</div>
  )
  // NOTE: Bug risk. This may not update in all circumstances but I think its fine
  const [isLiked, setIsLiked] = useState<boolean>(props.isLiked)
  // hooks

  // determine how to handle play / pause / number for render
  useEffect(() => {
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

  const handleLike = () => {
    axios.put(
      'https://api.spotify.com/v1/me/tracks',
      { ids: [props.trackId] },
      { headers: { Authorization: 'Bearer ' + props.token } }
    )
    setIsLiked(true)
  }

  const handleUnlike = () => {
    axios.delete('https://api.spotify.com/v1/me/tracks', {
      data: { ids: [props.trackId] },
      headers: { Authorization: 'Bearer ' + props.token },
    })
    setIsLiked(false)
  }

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
    alignItems: 'center',
    marginLeft: '16px',
    marginRight: '16px',
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
    height: '18px',
    width: '18px',
  }

  const playPauseIconStyle: React.CSSProperties = {
    height: '12px',
    width: '12px',
  }

  const trackInfoContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '200px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
    width: '150px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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

  const trackNumberStyle: React.CSSProperties = {
    width: '16px',
    marginRight: '5px',
  }

  const trackTitleStyle: React.CSSProperties = {
    width: '200px',
  }

  const trackAlbumStyle: React.CSSProperties = {
    width: '150px',
  }

  const trackLengthStyle: React.CSSProperties = {
    width: '50px',
  }

  const trackNumberAndInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }

  const lengthContainerStyle: React.CSSProperties = {
    display: 'flex',
    width: '40px',
    justifyContent: 'flex-end',
  }

  // TODO: NEXT SESSION START HERE

  // fix styling

  return (
    <div
      className={'trackContainerWrapper'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={'trackContainer'} style={trackContainerStyle}>
        <div className={'trackNumberAndInfo'} style={trackNumberAndInfoStyle}>
          <div className={'trackNumber'} style={trackNumberStyle}>
            {leftmostIcon}
          </div>
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
        </div>
        <div className={'albumName'} style={albumNameStyle}>
          {props.albumName}
        </div>
        <div className={'trackLength'} style={flexRowStyle}>
          <div className={'heartIconContainer'} style={heartIconContainerStyle}>
            {isLiked ? (
              <FullHeartIcon style={heartIconStyle} onClick={handleUnlike} />
            ) : (
              <EmptyHeartIcon style={heartIconStyle} onClick={handleLike} />
            )}
          </div>
          <div className={'lengthContainer'} style={lengthContainerStyle}>
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
      </div>
      <div style={separatorStyle}></div>
    </div>
  )
}
