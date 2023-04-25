import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TrackView } from '../TrackView/TrackView'
import ClockIcon from '../Svg/clockIcon'
import RewindIcon from '../Svg/rewindIcon'

interface playlistViewProps {
  token: string
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
    width: '100%',
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
    backgroundColor: 'black',
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

  const playlistItemStyle: React.CSSProperties = {
    marginLeft: '16px',
    marginRight: '16px',
  }

  return (
    <div className={'playlistContainer'} style={playlistContainerStyle}>
      <div className={'playlistHeader'} style={flexRowStyle}>
        <div className={'playlistImage'} style={playlistImageStyle}>
          <RewindIcon style={rewindStyle} />
          <img src={playlistImageUrl} alt={'Playlist Image'} />
        </div>
        <div className={'playlistTitle'} style={flexRowStyle}>
          <RewindIcon style={rewindStyle} />
          <div>{playlistName}</div>
        </div>
      </div>
      <div className={'separator'} style={separatorStyle} />
      <div className={'playlistTracksContainer'} style={playlistTracksContainerStyle}>
        <div className={'playlistTracksHeader'} style={playlistTracksHeaderStyle}>
          <div className={'trackNumberHeader'}>#</div>
          <div className={'trackTitleHeader'}>Title</div>
          <div className={'trackAlbumHeader'}>Album</div>
          <div className={'trackLengthHeader'}>
            <ClockIcon style={clockStyle} />
          </div>
        </div>
        <div className={'separator'} style={separatorStyle} />
        <div className={'playlistTracks'} style={playlistItemStyle}>
          {
            //TODO: make map after testing
          }
          <div className={'playlistItem'}>
            <TrackView
              trackNumber={1}
              albumPhotoUrl={
                'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'
              }
              trackName="testTrack"
              artistName="testArtist"
              albumName={'TestAlbum'}
              isLiked={true}
              trackLength={68012}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
