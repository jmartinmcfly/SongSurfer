import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TrackView } from '../TrackView/TrackView'
import ClockIcon from '../../Utils/Svg/clockIcon'
import RewindIcon from '../../Utils/Svg/rewindIcon'
import * as _ from 'lodash'
import SkipForwardIcon from '../../Utils/Svg/skipForwardIcon'
import SkipBackIcon from '../../Utils/Svg/skipBackIcon'
import RightArrowAltIcon from '../../Utils/Svg/rightArrowAltIcon'
import LeftArrowAltIcon from '../../Utils/Svg/leftArrowAltIcon'
import './PlaylistView.scss'

interface playlistViewProps {
  token: string
  currentPlaylist: any
  playlistHistory: any[]
  playlistHistoryIndex: number
  prevPlaylistHistoryIndex: number
  setPlaylistHistoryIndex: React.Dispatch<React.SetStateAction<number>>
  setPrevPlaylistHistoryIndex: React.Dispatch<React.SetStateAction<number>>
  player: any
  deviceId: string
  newlyAddedSongUris: string[]
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<any>>
  updatePlaylistHistory: (playlist: any) => void
  rerenderOnLikeTrigger: number
  setRerenderOnLikeTrigger: React.Dispatch<React.SetStateAction<number>>
  setNewlyAddedSongUris: React.Dispatch<React.SetStateAction<string[]>>
  setSubtractedNum: React.Dispatch<React.SetStateAction<Number>>
  setAddedNum: React.Dispatch<React.SetStateAction<Number>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
}

// styles

const playlistTracksContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const playlistTracksHeaderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
}

const playlistTracksStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export const PlaylistView = (props: playlistViewProps) => {
  const [playlistImageUrl, setPlaylistImageUrl] = useState('test')
  const [playlistName, setPlaylistName] = useState('test')
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [likedDict, setLikedDict] = useState<Record<string, boolean>>({})
  const [trackViewComps, setTrackViewComps] = useState<JSX.Element[]>([])

  // store the currentPlaylist.track.items for each step in the history
  const [isBackButtonHovered, setIsBackButtonHovered] = useState<boolean>(false)
  const [isForwardButtonHovered, setIsForwardButtonHovered] = useState<boolean>(false)

  // add a new playlist state from a given state clears the rest of the forward history from there

  // hooks

  // fetch liked songs data
  // TODO: Start here
  useEffect(() => {
    if (
      props.playlistHistory.length > 0 &&
      props.playlistHistory.length > props.playlistHistoryIndex
    ) {
      let songIds: string[] = []
      console.log('in liked songs effect')
      // history is truncating or index is getting extended

      // extract song ids from playlist
      for (const item of props.playlistHistory[props.playlistHistoryIndex].tracks.items) {
        songIds.push(item.track.id)
      }

      // TODO: handle race condition on multiple requests
      // get isLiked data from spotify
      const result = axios
        .get('https://api.spotify.com/v1/me/tracks/contains', {
          headers: { Authorization: 'Bearer ' + props.token },
          params: {
            ids: songIds.join(','),
          },
        })
        .then((response) => {
          // create new liked dict
          let newLikedDict: Record<string, boolean> = {}
          for (let i: number = 0; i < songIds.length; i++) {
            const songId: string = songIds[i]
            const isLiked: boolean = response.data[i]
            newLikedDict[songId] = isLiked
          }
          setLikedDict(newLikedDict)
        })

      // get current track
      const result2 = props.player.getCurrentState().then((state: any) => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK')
          return
        }

        setCurrentTrack(state.track_window.current_track)
        setIsPlaying(!state.paused)
      })

      props.player.addListener('player_state_changed', (state: any) => {
        if (!state) {
          return
        }

        setCurrentTrack(state.track_window.current_track)
        setIsPlaying(!state.paused)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlistHistory, props.playlistHistoryIndex, props.rerenderOnLikeTrigger])

  // TODO

  // update the track view components when the current playing song changes
  useEffect(() => {
    if (props.playlistHistory.length > 0) {
      const newTrackViewComps: JSX.Element[] = createTrackViewComps(
        props.playlistHistory[props.playlistHistoryIndex]
      )
      console.log('setting track view Comps')
      setTrackViewComps(newTrackViewComps)
      console.log('currentIndex')
      console.log(props.playlistHistoryIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, isPlaying, props.newlyAddedSongUris])

  const createTrackViewComps = (playlist: any) => {
    const newTrackViewComps: JSX.Element[] = playlist.tracks.items.map(
      (item: any, index: number) => {
        let isCurrentTrack: boolean = false
        if (currentTrack) {
          isCurrentTrack = currentTrack.name == item.track.name
          console.log(isCurrentTrack)
        }
        return (
          <TrackView
            token={props.token}
            key={item.track.id + index.toString() + likedDict[item.track.id]?.toString()}
            trackNumber={index + 1}
            albumPhotoUrl={item.track.album.images[0].url}
            trackName={item.track.name}
            artistName={item.track.artists[0].name}
            albumName={item.track.album.name}
            isLiked={likedDict[item.track.id]}
            trackLength={item.track.duration_ms}
            trackUri={item.track.uri}
            albumUri={item.track.album.uri}
            artistUri={item.track.artists[0].uri}
            trackId={item.track.id}
            player={props.player}
            deviceId={props.deviceId}
            currentPlaylist={props.playlistHistory[props.playlistHistoryIndex]}
            isCurrentTrack={isCurrentTrack}
            isPlaying={isPlaying}
            newlyAddedSongUris={props.newlyAddedSongUris}
            setCurrentPlaylist={props.setCurrentPlaylist}
            updatePlaylistHistory={(playlist) => {
              props.updatePlaylistHistory(playlist)
              console.log('updating playlist history in trackView')
            }}
            rerenderOnLikeTrigger={props.rerenderOnLikeTrigger}
            setRerenderOnLikeTrigger={props.setRerenderOnLikeTrigger}
          />
        )
      }
    )

    return newTrackViewComps
  }

  // update the track view components when the playlist history
  // or playlist history index changes

  useEffect(() => {
    console.log('the history and index')
    console.log(props.playlistHistory)
    console.log(props.playlistHistoryIndex)

    if (
      props.playlistHistory.length > 0 &&
      props.playlistHistory.length < props.playlistHistoryIndex
    ) {
      const newTrackViewComps: JSX.Element[] = createTrackViewComps(
        props.playlistHistory[props.playlistHistoryIndex]
      )
      setTrackViewComps(newTrackViewComps)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlistHistoryIndex, props.playlistHistory])

  // for deep copying objects
  const deepCopy = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
  }

  // event handlers
  // START HERE
  // TODO: Reload spotify playlist data when the changes history

  const handleHistoryBackClick = () => {
    if (props.playlistHistoryIndex > 0) {
      props.setPrevPlaylistHistoryIndex(props.playlistHistoryIndex)
      props.setPlaylistHistoryIndex(props.playlistHistoryIndex - 1)
      console.log('setting index to:')
      console.log(props.playlistHistoryIndex - 1)
      console.log('from:')
      console.log(props.playlistHistoryIndex)
      if (props.playlistHistoryIndex - 1 == 0) {
        setIsBackButtonHovered(false)
      }
      console.log('back')
      console.log(props.playlistHistoryIndex - 1)
      // props.setCurrentPlaylist(playlistHistory[playlistHistoryIndex - 1])
    }
  }

  const handleHistoryForwardClick = () => {
    if (props.playlistHistoryIndex < props.playlistHistory.length - 1) {
      console.log('setting index')
      console.log(props.playlistHistoryIndex + 1)
      props.setPrevPlaylistHistoryIndex(props.playlistHistoryIndex)
      props.setPlaylistHistoryIndex(props.playlistHistoryIndex + 1)
      if (props.playlistHistoryIndex + 1 == props.playlistHistory.length - 1) {
        setIsForwardButtonHovered(false)
      }
      console.log('forward')
      console.log(props.playlistHistoryIndex + 1)
      // props.setCurrentPlaylist(playlistHistory[playlistHistoryIndex + 1])
    }
  }

  const handleMouseEnterBackButton = () => {
    if (props.playlistHistory.length > 1 && props.playlistHistoryIndex > 0) {
      setIsBackButtonHovered(true)
    }
  }

  const handleMouseEnterForwardButton = () => {
    if (props.playlistHistoryIndex < props.playlistHistory.length - 1) {
      setIsForwardButtonHovered(true)
    }
  }

  const handleMouseLeaveBackButton = () => {
    setIsBackButtonHovered(false)
  }

  const handleMouseLeaveForwardButton = () => {
    setIsForwardButtonHovered(false)
  }

  // styles

  const rewindStyle: React.CSSProperties = {
    display: 'flex',
    height: '16px',
    width: '16px',
  }

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    height: '16px',
    width: '16px',
  }

  const playlistContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
  }

  const playlistImageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '16px',
  }

  const playlistHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  }

  const flexRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

  const separatorStyle: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: '#444654',
    margin: '16px 0px 16px 0px',
  }

  const width100: React.CSSProperties = {
    width: '100%',
  }

  const playlistTracksContainerStyle: React.CSSProperties = {
    width: '100%',
  }

  const playlistTracksHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '16px',
    marginRight: '16px',
  }

  const playlistItemStyle: React.CSSProperties = {}

  const trackNumberHeaderStyle: React.CSSProperties = {
    width: '16px',
    marginRight: '5px',
    color: '#c4c4c4',
  }

  const trackTitleHeaderStyle: React.CSSProperties = {
    width: '200px',
    color: '#c4c4c4',
  }

  const trackAlbumHeaderStyle: React.CSSProperties = {
    width: '150px',
    color: '#c4c4c4',
    flex: 2,
  }

  const trackLengthHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '68px',
    paddingRight: '2px',
    fill: '#c4c4c4',
  }

  const numberAndTitleHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flex: 2,
    marginRight: '15px',
  }

  const historyButtonStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    fill: '#9b9b9b',
  }

  const historyBackButtonStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    fill: '#9b9b9b',
  }

  const historyControlsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  }

  const historyControlDivStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
  }

  const historyControlDivHoveredStyle: React.CSSProperties = {
    ...historyControlDivStyle,
    backgroundColor: '#ffffff',
    borderRadius: '50%',
  }

  const historyControlLeftDivStyle: React.CSSProperties = {
    ...historyControlDivStyle,
    marginRight: '7px',
  }
  const historyControlLeftDivHoveredStyle: React.CSSProperties = {
    ...historyControlDivHoveredStyle,
    marginRight: '7px',
  }

  return (
    <div className={'playlistContainer'} style={playlistContainerStyle}>
      {/*<div className={'playlistHeader'} style={flexRowStyle}>
        <div className={'playlistImage'} style={playlistImageStyle}>
          <RewindIcon style={rewindStyle} />
          <img src={playlistImageUrl} alt={'Playlist Image'} />
        </div>
        <div className={'playlistTitle'} style={flexRowStyle}>
          <RewindIcon style={rewindStyle} />
          <div>{playlistName}</div>
        </div>
      </div> */}
      <div className={'historyControlsContainer'} style={historyControlsContainerStyle}>
        {isBackButtonHovered ? (
          <div className={'historyControlDiv'} style={historyControlLeftDivHoveredStyle}>
            <LeftArrowAltIcon
              style={historyBackButtonStyle}
              onClick={handleHistoryBackClick}
              onMouseLeave={handleMouseLeaveBackButton}
            />
          </div>
        ) : (
          <div className={'historyControlDiv'} style={historyControlLeftDivStyle}>
            <LeftArrowAltIcon
              style={historyBackButtonStyle}
              onClick={handleHistoryBackClick}
              onMouseEnter={handleMouseEnterBackButton}
            />
          </div>
        )}

        {isForwardButtonHovered ? (
          <div
            className={'historyControlDiv'}
            style={historyControlDivHoveredStyle}
            onClick={handleHistoryForwardClick}
            onMouseLeave={handleMouseLeaveForwardButton}
          >
            <RightArrowAltIcon style={historyButtonStyle} />
          </div>
        ) : (
          <div
            className={'historyControlDiv'}
            style={historyControlDivStyle}
            onClick={handleHistoryForwardClick}
            onMouseEnter={handleMouseEnterForwardButton}
          >
            <RightArrowAltIcon style={historyButtonStyle} />
          </div>
        )}
      </div>
      <div className={'separator'} style={separatorStyle} />
      <div className={'playlistTracksContainer'} style={playlistTracksContainerStyle}>
        <div className={'playlistTracksHeader'} style={playlistTracksHeaderStyle}>
          <div className={'numberAndTitleHeader'} style={numberAndTitleHeaderStyle}>
            <div className={'trackNumberHeader'} style={trackNumberHeaderStyle}>
              #
            </div>
            <div className={'trackTitleHeader'} style={trackTitleHeaderStyle}>
              Title
            </div>
          </div>
          <div className={'trackAlbumHeader'} style={trackAlbumHeaderStyle}>
            Album
          </div>
          <div className={'trackLengthHeader'} style={trackLengthHeaderStyle}>
            <ClockIcon style={clockStyle} />
          </div>
        </div>
        <div className={'separator'} style={separatorStyle} />
        <div className={'playlistTracks'} style={playlistItemStyle}>
          {trackViewComps}
        </div>
      </div>
    </div>
  )
}
