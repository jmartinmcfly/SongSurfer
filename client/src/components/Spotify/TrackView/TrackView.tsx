import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EmptyHeartIcon from '../../Utils/Svg/emptyHeartIcon'
import FullHeartIcon from '../../Utils/Svg/fullHeartIcon'
import PlayIcon from '../../Utils/Svg/playIcon'
import PauseIcon from '../../Utils/Svg/pauseIcon'
import { kMaxLength } from 'buffer'
import '../MusicPlayer/MusicPlayer.scss'
import './TrackView.scss'
import XIcon from '../../Utils/Svg/xIcon'
import { decodedTextSpanIntersectsWith } from 'typescript'

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
  albumUri: string
  artistUri: string
  trackId: string
  player: any
  deviceId: string
  currentPlaylist: any
  isCurrentTrack: boolean
  isPlaying: boolean
  newlyAddedSongUris: string[]
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<any>>
  updatePlaylistHistory: (playlist: any) => void
  rerenderOnLikeTrigger: number
  setRerenderOnLikeTrigger: React.Dispatch<React.SetStateAction<number>>
}

export const TrackView = (props: trackViewProps) => {
  const [trackNumWrapperStyle, setTrackNumWrapperStyle] = useState<React.CSSProperties>({
    display: 'flex',
    justifyContent: 'flex-end',
    width: '10px',
    marginRight: '15px',
  })
  const [trackNumStyle, setTrackNumStyle] = useState<React.CSSProperties>({})
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [lengthIsHovering, setLengthIsHovering] = useState<boolean>(false)
  const [leftmostIcon, setLeftmostIcon] = useState<JSX.Element>(
    <div>{props.trackNumber}</div>
  )
  const [lengthContainerStyle, setLengthContainerStyle] = useState<React.CSSProperties>({
    display: 'flex',
    width: '40px',
    justifyContent: 'flex-end',
  })
  // NOTE: Bug risk. This may not update in all circumstances but I think its fine
  const [isLiked, setIsLiked] = useState<boolean>(props.isLiked)
  // hooks

  // determine how to handle play / pause / number for render
  useEffect(() => {
    if (props.isCurrentTrack) {
      console.log('is current track playing?')
      console.log(props.isPlaying)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering, props.isCurrentTrack, props.isPlaying])

  // handle styling for isNew
  useEffect(() => {
    let isNew = false
    for (const newUri of props.newlyAddedSongUris) {
      // set true if match
      isNew = isNew || props.trackUri === newUri
    }

    if (isNew) {
      let width = ''
      let marginLeft = ''
      if (props.trackNumber < 10) {
        width = '20px'
        marginLeft = '-10px'
      } else if (props.trackNumber < 100) {
        width = '20px'
        marginLeft = '-10px'
      } else {
        width = '30px'
        marginLeft = ''
      }
      const trackNumberStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        background: 'radial-gradient(circle, #fefefe, transparent)',
      }

      const trackNumberWrapperStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        width: width,
        marginLeft: marginLeft,
        marginRight: '15px',
        borderRadius: '20%',
        // TODO: background to the number's div, not it's wrapper
        color: '#121212',
      }
      setTrackNumWrapperStyle(trackNumberWrapperStyle)
      setTrackNumStyle(trackNumberStyle)

      // hack because the timeout in MainInterface to set newlyAddeSongURIs
      // isn't trigerring a rerender for some reason

      setTimeout(() => {
        const trackNumberWrapperStyle: React.CSSProperties = {
          display: 'flex',
          justifyContent: 'flex-end',
          width: '10px',
          marginRight: '15px',
        }
        const trackNumberStyle: React.CSSProperties = {}
        setTrackNumWrapperStyle(trackNumberWrapperStyle)
        setTrackNumStyle(trackNumberStyle)
      }, 5000)
    } else {
      const trackNumberWrapperStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '10px',
        marginRight: '15px',
      }
      const trackNumberStyle: React.CSSProperties = {}
      setTrackNumWrapperStyle(trackNumberWrapperStyle)
      setTrackNumStyle(trackNumberStyle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.newlyAddedSongUris])

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
    axios
      .put(
        'https://api.spotify.com/v1/me/tracks',
        { ids: [props.trackId] },
        { headers: { Authorization: 'Bearer ' + props.token } }
      )
      .then(() => {
        console.log('handling like')
        props.setRerenderOnLikeTrigger(props.rerenderOnLikeTrigger + 1)
      })
    setIsLiked(true)
  }

  const handleUnlike = () => {
    axios
      .delete('https://api.spotify.com/v1/me/tracks', {
        data: { ids: [props.trackId] },
        headers: { Authorization: 'Bearer ' + props.token },
      })
      .then(() => {
        console.log('handling unlike')
        props.setRerenderOnLikeTrigger(props.rerenderOnLikeTrigger + 1)
      })
    setIsLiked(false)
  }

  const handleTrackRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    const uri = props.trackUri.replace('spotify:track:', '')
    window.open('https://open.spotify.com/track/' + uri)
  }

  const handleAlbumRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    const uri = props.albumUri.replace('spotify:album:', '')
    window.open('https://open.spotify.com/album/' + uri)
  }

  const handleArtistRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
    const uri = props.artistUri.replace('spotify:artist:', '')
    window.open('https://open.spotify.com/artist/' + uri)
  }

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    // TODO
    // Make API call to delete an item from the playlist
    const result = axios
      .delete(
        'https://api.spotify.com/v1/playlists/' + props.currentPlaylist.id + '/tracks',
        {
          data: { tracks: [{ uri: props.trackUri }] },
          headers: { Authorization: 'Bearer ' + props.token },
        }
      )
      .then((res) => {
        //TODO: update playlist
        axios
          .get('https://api.spotify.com/v1/playlists/' + props.currentPlaylist.id, {
            headers: { Authorization: 'Bearer ' + props.token },
          })
          .then((resp) => {
            props.updatePlaylistHistory(resp.data)
          })
      })
  }

  const handleMouseEnterLen = () => {
    setLengthIsHovering(true)
    setLengthContainerStyle({
      display: 'flex',
      width: '33px',
      justifyContent: 'flex-end',
      paddingTop: '2px',
      paddingRight: '7px',
    })
  }
  const handleMouseLeaveLen = () => {
    setLengthIsHovering(false)
    setLengthContainerStyle({
      display: 'flex',
      width: '40px',
      justifyContent: 'flex-end',
    })
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

  const xIconStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    height: '14px',
    width: '14px',
    fill: '#ffffff',
  }

  const playPauseIconStyle: React.CSSProperties = {
    height: '12px',
    width: '12px',
    fill: '#0fa37f',
  }

  const trackInfoContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '200px',
    flex: 2,
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
    flex: 2,
    width: '150px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }

  const heartIconContainerStyle: React.CSSProperties = {
    marginRight: '10px',
    // fill: '#0fa37f',
    fill: 'white',
  }

  const separatorStyle: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: '#444654',
    margin: '16px 0px 16px 0px',
  }

  const trackNumberStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '10px',
    marginRight: '15px',
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
    flex: 2,
    marginRight: '15px',
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
          <div className={'trackNumber'} style={trackNumWrapperStyle}>
            <div style={trackNumStyle}>{leftmostIcon}</div>
          </div>
          <div className={'trackInfoContainer'} style={trackInfoContainerStyle}>
            <img src={props.albumPhotoUrl} style={albumPhotoStyle} />
            <div className={'trackTextContainer'} style={trackTextContainerStyle}>
              <div
                className={'clickableText trackName'}
                style={trackNameStyle}
                onClick={handleTrackRedirect}
              >
                {props.trackName}
              </div>
              <div
                className={'clickableText artistName'}
                style={artistNameStyle}
                onClick={handleArtistRedirect}
              >
                {props.artistName}
              </div>
            </div>
          </div>
        </div>
        <div
          className={'clickableText albumName'}
          style={albumNameStyle}
          onClick={handleAlbumRedirect}
        >
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

          <div
            className={'lengthContainer'}
            style={lengthContainerStyle}
            onMouseEnter={handleMouseEnterLen}
            onMouseLeave={handleMouseLeaveLen}
          >
            {lengthIsHovering ? (
              <XIcon onClick={handleDelete} style={xIconStyle} />
            ) : Math.floor((props.trackLength / 1000) % 60) < 10 ? (
              Math.floor(props.trackLength / 1000 / 60) +
              ':' +
              '0' +
              Math.floor((props.trackLength / 1000) % 60)
            ) : (
              Math.floor(props.trackLength / 1000 / 60) +
              ':' +
              Math.floor((props.trackLength / 1000) % 60)
            )}
          </div>
        </div>
      </div>
      <div style={separatorStyle}></div>
    </div>
  )
}
