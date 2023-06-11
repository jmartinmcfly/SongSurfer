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
  player: any
  deviceId: string
  newlyAddedSongUris: string[]
  setCurrentPlaylist: React.Dispatch<React.SetStateAction<any>>
  rerenderOnLikeTrigger: number
  setRerenderOnLikeTrigger: React.Dispatch<React.SetStateAction<number>>
  isNewPlaylist: boolean
  setIsNewPlaylist: React.Dispatch<React.SetStateAction<boolean>>
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
  //TODO reset state after testing
  const [playlistImageUrl, setPlaylistImageUrl] = useState('test')
  const [playlistName, setPlaylistName] = useState('test')
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [likedDict, setLikedDict] = useState<Record<string, boolean>>({})
  const [trackViewComps, setTrackViewComps] = useState<JSX.Element[]>([])

  // TODO: Store a history of playlists to allow for back and forward button
  // store the currentPlaylist.track.items for each step in the history
  const [playlistHistory, setPlaylistHistory] = useState<any[]>([])
  const [playlistComponentHistory, setPlaylistComponentHistory] = useState<
    JSX.Element[][]
  >([])
  const [playlistHistoryIndex, setPlaylistHistoryIndex] = useState<number>(0)
  const [playlistHistoryPrevIndex, setPlaylistHistoryPrevIndex] = useState<number>(0)
  const [isBackButtonHovered, setIsBackButtonHovered] = useState<boolean>(false)
  const [isForwardButtonHovered, setIsForwardButtonHovered] = useState<boolean>(false)

  // add a new playlist state from a given state clears the rest of the forward history from there

  // hooks

  // fetch liked songs data
  useEffect(() => {
    if (props.currentPlaylist) {
      let songIds: string[] = []

      // extract song ids from playlist
      for (const item of props.currentPlaylist.tracks.items) {
        songIds.push(item.track.id)
      }

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
  }, [props.currentPlaylist, props.rerenderOnLikeTrigger])

  // NOTE: this maybe won't load until the "Check User's Saved Tracks" call returns
  // if desired, this can be optimized later

  // modifies playlist history and playlist component history when
  // a playlist is modified via chat or delete
  useEffect(() => {
    if (props.currentPlaylist) {
      // construct a list of jsx TrackView components to render
      const newTrackViewComps: JSX.Element[] = createTrackViewComps(props.currentPlaylist)

      setTrackViewComps(newTrackViewComps)

      // runs once for every new playlist
      if (props.isNewPlaylist) {
        console.log('new playlist')
        props.setIsNewPlaylist(false)

        if (playlistHistory.length == 0) {
          console.log('initializing history')
          setPlaylistHistory([props.currentPlaylist])
          setPlaylistComponentHistory([newTrackViewComps])
          setPlaylistHistoryIndex(0)
        } else if (
          // if the current playlist is the same as the current index in history, do nothing
          // NOTE: branch may not be needed, although my catch
          // edge case where the playlist isn't modified because of failed spotify api call
          // NOTE: do we need to setTrackViewComps here?
          _.isEqual(props.currentPlaylist, playlistHistory[playlistHistoryIndex])
        ) {
          // do nothing
        } else if (playlistHistoryIndex == playlistHistory.length - 1) {
          // if we're at the front of the history and the playlist had changed
          // add the new playlist to the history
          console.log('adding to history')
          console.log(playlistHistory)
          console.log(props.currentPlaylist)
          setPlaylistHistory([...playlistHistory, props.currentPlaylist])
          setPlaylistComponentHistory([...playlistComponentHistory, newTrackViewComps])
          setPlaylistHistoryPrevIndex(playlistHistoryIndex)
          setPlaylistHistoryIndex(playlistHistoryIndex + 1)
        } else {
          // if we're in the middle of the history and the playlist had changed
          // remove all playlists after the current index and add the new playlist
          const truncatedPlaylistHistory = playlistHistory.slice(
            0,
            playlistHistoryIndex + 1
          )
          const truncatedPlaylistComponentHistory = playlistComponentHistory.slice(
            0,
            playlistHistoryIndex + 1
          )
          setPlaylistHistory([...truncatedPlaylistHistory, props.currentPlaylist])
          setPlaylistComponentHistory([
            ...truncatedPlaylistComponentHistory,
            newTrackViewComps,
          ])
          setPlaylistHistoryPrevIndex(playlistHistoryIndex)
          setPlaylistHistoryIndex(playlistHistoryIndex + 1)
        }

        console.log('playlistHistory', playlistHistory)
        console.log('playlistComponentHistory', playlistComponentHistory)
      }
    }
  }, [likedDict, currentTrack, isPlaying, playlistHistoryIndex, props.currentPlaylist])

  const createTrackViewComps = (playlist: any) => {
    const newTrackViewComps: JSX.Element[] = playlist.tracks.items.map(
      (item: any, index: number) => {
        let isCurrentTrack: boolean = false
        if (currentTrack) {
          isCurrentTrack = currentTrack.name == item.track.name
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
            currentPlaylist={props.currentPlaylist}
            isCurrentTrack={isCurrentTrack}
            isPlaying={isPlaying}
            newlyAddedSongUris={props.newlyAddedSongUris}
            setCurrentPlaylist={props.setCurrentPlaylist}
            rerenderOnLikeTrigger={props.rerenderOnLikeTrigger}
            setRerenderOnLikeTrigger={props.setRerenderOnLikeTrigger}
            setIsNewPlaylist={props.setIsNewPlaylist}
          />
        )
      }
    )

    return newTrackViewComps
  }

  // handles when user pages through the history
  // playlistHistoryIndex is guaranteed to be valid
  useEffect(() => {
    // props.setCurrentPlaylist(playlistHistory[playlistHistoryIndex])
    // triggers immediate rerender before api calls resolve
    //TODO: start here
    console.log('playlistHistoryIndex', playlistHistoryIndex)
    console.log('playlistHistoryPrevIndex', playlistHistoryPrevIndex)
    console.log('playlistHistory', playlistHistory)

    if (playlistHistory[playlistHistoryIndex]) {
      const newTrackViewComps: JSX.Element[] = createTrackViewComps(
        playlistHistory[playlistHistoryIndex]
      )

      setTrackViewComps(newTrackViewComps)
    }

    // update the spotify playlist to match what is showing
    // dif the playlists to find add and delete
    const lastPlaylist = playlistHistory[playlistHistoryPrevIndex]
    const currentPlaylist = playlistHistory[playlistHistoryIndex]

    if (lastPlaylist && currentPlaylist) {
      const trackUris = currentPlaylist.tracks.items.map((item: any) => item.track.uri)
      // Add Items to Playlist
      // Update Playlist Items
      const apiResponse = axios
        .put(
          'https://api.spotify.com/v1/playlists/' + currentPlaylist.id + '/tracks',
          { uris: currentPlaylist.tracks.items.map((item: any) => item.track.uri) },
          {
            headers: { Authorization: 'Bearer ' + props.token },
          }
        )
        .then((resp) => {
          axios
            .get('https://api.spotify.com/v1/playlists/' + currentPlaylist.id, {
              headers: { Authorization: 'Bearer ' + props.token },
            })
            .then((resp) => {
              props.setCurrentPlaylist(resp.data)
              const diff = playlistDiff(lastPlaylist, currentPlaylist)

              console.log('the diff is ', diff.addedTrackUris)
              props.setNewlyAddedSongUris(diff.addedTrackUris)
              //props.setSubtractedNum(diff.deletedTrackUris.length)
              // props.setAddedNum(diff.addedTrackUris.length)
              //props.setIsModified(true)

              setTimeout(() => {
                let empty: any[] = []
                // props.setNewlyAddedSongUris(empty)
              }, 5000)
            })
          // set newly added uris based on diff
        })

      // TOD; go index by index and reorder
    }
  }, [playlistHistoryIndex])

  const playlistDiff = (
    prevPlaylist: any,
    currPlaylist: any
  ): { addedTrackUris: string[]; deletedTrackUris: string[] } => {
    const prevTrackIds = prevPlaylist.tracks.items.map((item: any) => {
      return item.track.uri
    })
    const currTrackIds = currPlaylist.tracks.items.map((item: any) => {
      return item.track.uri
    })

    const addedTrackIds = _.difference(currTrackIds, prevTrackIds)
    const deletedTrackIds = _.difference(prevTrackIds, currTrackIds)

    const addedTracks = currPlaylist.tracks.items.filter((item: any) => {
      return addedTrackIds.includes(item.track.uri)
    })
    const deletedTracks = prevPlaylist.tracks.items.filter((item: any) => {
      return deletedTrackIds.includes(item.track.uri)
    })

    const addedTrackUris = addedTracks.map((item: any) => {
      return item.track.uri
    })

    const deletedTrackUris = deletedTracks.map((item: any) => {
      return item.track.uri
    })

    console.log('addedTracks', addedTracks)
    console.log('deletedTracks', deletedTracks)

    return { addedTrackUris, deletedTrackUris }
  }

  // for deep copying objects
  const deepCopy = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
  }

  // event handlers
  // START HERE
  // TODO: Reload spotify playlist data when the changes history

  const handleHistoryBackClick = () => {
    if (playlistHistoryIndex > 0) {
      setPlaylistHistoryPrevIndex(playlistHistoryIndex)
      setPlaylistHistoryIndex(playlistHistoryIndex - 1)
      if (playlistHistoryIndex - 1 == 0) {
        setIsBackButtonHovered(false)
      }
      // props.setCurrentPlaylist(playlistHistory[playlistHistoryIndex - 1])
    }
  }

  const handleHistoryForwardClick = () => {
    if (playlistHistoryIndex < playlistHistory.length - 1) {
      setPlaylistHistoryPrevIndex(playlistHistoryIndex)
      setPlaylistHistoryIndex(playlistHistoryIndex + 1)
      if (playlistHistoryIndex + 1 == playlistHistory.length - 1) {
        setIsForwardButtonHovered(false)
      }
      // props.setCurrentPlaylist(playlistHistory[playlistHistoryIndex + 1])
    }
  }

  const handleMouseEnterBackButton = () => {
    if (playlistHistory.length > 1 && playlistHistoryIndex > 0) {
      setIsBackButtonHovered(true)
    }
  }

  const handleMouseEnterForwardButton = () => {
    if (playlistHistoryIndex < playlistHistory.length - 1) {
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
