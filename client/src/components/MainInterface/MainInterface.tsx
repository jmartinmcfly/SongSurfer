import React, { useState, useEffect, useRef } from 'react'
import { Buffer } from 'buffer'
import axios from 'axios'
import { Configuration, OpenAIApi } from 'openai'
import { useLocation } from 'react-router-dom'
import { AuthHandler } from '../Auth/AuthHandler/AuthHandler'
import { MusicPlayer } from '../Spotify/MusicPlayer/MusicPlayer'
import { PlaylistView } from '../Spotify/PlaylistView/PlaylistView'
import * as _ from 'lodash'
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
} from '../../types'
import {
  ChatVisualizer,
  ChatVisualizerProps,
} from '../Chat/ChatVisualizer/ChatVisualizer'
import { ChatInput } from '../Chat/ChatInput/ChatInput'
import { promptText, promptTestText, initialResponseText } from './promptText'
import { Intro } from '../Intro/Intro'
import './MainInterface.scss'
import { exec } from 'child_process'

/* eslint-disable react-hooks/exhaustive-deps */

interface MainInterfaceProps {
  state: string
}

interface PlaylistAction {
  actionType: 'add' | 'remove' | 'replace'
  tracks: { track: string; artist: string; album: string }[]
}

export enum Role {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export const MainInterface = (props: MainInterfaceProps) => {
  let playlistActionsNumber: number = 0

  const [openAiApi, setOpenAIApi] = useState<OpenAIApi | null>(null)

  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [profileData, setProfileData] = useState<any>(null)

  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null)
  const [newlyAddedSongUris, setNewlyAddedSongUris] = useState<string[]>([])
  const [playlistHistoryIndex, setPlaylistHistoryIndex] = useState<number>(0)
  const [prevPlaylistHistoryIndex, setPrevPlaylistHistoryIndex] = useState<number>(0)
  const [playlistHistory, setPlaylistHistory] = useState<any[]>([])

  const [isModified, setIsModified] = useState<boolean>(false)
  const [rerenderOnModifiedTrigger, setRerenderOnModifiedTrigger] = useState<number>(0)
  const [addedNum, setAddedNum] = useState<Number>(0)
  const [subtractedNum, setSubtractedNum] = useState<Number>(0)
  const [numNotificationTextList, setNumNotificationTextList] = useState<string[]>([])
  const [isFading, setIsFading] = useState<boolean>(false)

  const [rerenderOnLikeTrigger, setRerenderOnLikeTrigger] = useState<number>(0)
  // used to determine whether to modify playlist history in PlaylistView
  // set when user modifies a playlist via chat or delete button

  // waiting for chat response
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const location = useLocation()
  const mainInterfaceContainerRef = useRef<HTMLDivElement>(null)

  // passed to the ChatVisualizer for rendering. Excludes tokens meant for prompt engineering.
  const [viewChatHistory, setViewChatHistory] = useState<
    { role: Role; content: string }[]
  >([
    { role: Role.User, content: promptText },
    { role: Role.Assistant, content: initialResponseText },
  ])
  // for calling OpenAI API. Truncates earlier user chats (but not the prompt).
  // keeps prompt engineering text (incl gpts json responses)
  const [truncatedChatHistoryIncSystem, setTruncatedChatHistoryIncSystem] = useState<
    { role: Role; content: string }[]
  >([
    { role: Role.User, content: promptText },
    { role: Role.Assistant, content: initialResponseText },
  ])

  // initialize OpenAI API
  useEffect(() => {
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    setOpenAIApi(openai)
  }, [])

  // fetch profile data once access token is set
  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching profile data')
      fetchProfileData().then((data) => {
        setProfileData(data)
        console.log('profile data set')
        console.log(data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // fetch playlist data once profile data is set
  useEffect(() => {
    if (profileData) {
      if (playlistHistory.length > 0) {
        return
      }

      console.log('fetching playlists')
      fetchPlaylists().then((data) => {
        // data.items are simplifiedPlaylistObjects
        const playlists = data.items
        let found: boolean = false
        for (const playlist of playlists) {
          if (playlist.name == 'DJ-GPT') {
            found = true
            console.log('found playlists')
            console.log(playlist)
            // fetch full playlist object
            axios
              .get('https://api.spotify.com/v1/playlists/' + playlist.id, {
                headers: { Authorization: 'Bearer ' + accessToken },
              })
              .then((resp) => {
                setPlaylistHistory([resp.data])
                console.log('setting index')
                console.log(0)
                setPlaylistHistoryIndex(0)
                setPrevPlaylistHistoryIndex(0)
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
              setPlaylistHistory([resp.data])
              console.log('setting index')
              console.log(0)
              setPlaylistHistoryIndex(0)
              setPrevPlaylistHistoryIndex(0)
            })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId])

  // handle modifiedNotification
  useEffect(() => {
    if (isModified) {
      console.log('isModified is true')
      console.log(addedNum)
      console.log(subtractedNum)
      let tempDivList = []
      if (addedNum !== 0) {
        tempDivList.push('+ ' + addedNum.toString())
      }

      if (subtractedNum !== 0 && addedNum !== 0) {
        tempDivList.push(', - ' + subtractedNum.toString())
      } else if (subtractedNum !== 0) {
        tempDivList.push('- ' + subtractedNum.toString())
      }

      setNumNotificationTextList(tempDivList)

      // fade out after 5s
      setTimeout(() => {
        setIsFading(true)

        // make div not render after fade
        setTimeout(() => {
          setIsModified(false)
          setIsFading(false)
          setAddedNum(0)
          setSubtractedNum(0)
        }, 2200)
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModified, rerenderOnModifiedTrigger])

  // API calls:

  async function fetchProfileData(): Promise<any> {
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

  const handleNotificationClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })

    setIsFading(true)
  }

  // START HERE: clean^ out the console.logs
  // then, review this whole compoment and make sure it's all good
  // then, head back to the project plan

  const generateMessage = (
    message: string
  ): Promise<{ role: Role; content: string }[]> => {
    // append message prelude
    const messagePrelude =
      'System message: Please pay extra attention to "actionType". When iterating on a playlist, use "add" to add songs, and "remove" to remove songs. Only use "replace" when starting a totally new playlist. DON\'T follow the remove action with an add action unless EXPLICTLY prompted - this results in duplicates. Also, only ever put one JSON object in the response - multiple breaks our software. Please add a natural language description after the JSON.'

    let playlistContext: string = '\nUser: '

    // set the context - expensive, but necessary
    // ROADMAP: condense playlist representation using GPT-3 (or at least cap size)

    if (playlistHistory.length == 0) {
      alert('Failure to load playlist object. Please refresh the page.')
    }

    // get tracks in current playlist from playlistHistory
    const extractedCurrentPlaylist = playlistHistory[
      playlistHistoryIndex
    ].tracks.items.map((item: any) => {
      return {
        track: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
      }
    })

    // grab every xth item such that we grab roughly 20 items
    let trimmedCurrentPlaylist

    if (extractedCurrentPlaylist.length > 20) {
      let everyX = Math.ceil(extractedCurrentPlaylist.length / 20)
      trimmedCurrentPlaylist = extractedCurrentPlaylist.filter(
        (item: any, index: number) => index % everyX == 0
      )
    } else {
      trimmedCurrentPlaylist = extractedCurrentPlaylist
    }

    playlistContext =
      ' This is the playlist as it currently stands: ' +
      JSON.stringify(trimmedCurrentPlaylist) +
      playlistContext

    const messagePreludeFinal = messagePrelude + playlistContext

    console.log('message Prelude')
    console.log(messagePreludeFinal)
    console.log(truncatedChatHistoryIncSystem)

    // Token manager
    const toSend: Promise<{ role: Role; content: string }[]> = trimTokens(
      messagePreludeFinal + message,
      truncatedChatHistoryIncSystem
    )

    // set the chat history with the newly crafted message
    // we leave out the prelude, it isn't necessary to have repeated in
    // the chat history

    setViewChatHistory((prevItems) => [
      ...prevItems,
      { role: Role.User, content: message },
    ])
    setTruncatedChatHistoryIncSystem((prevItems) => [
      ...prevItems,
      { role: Role.User, content: message },
    ])

    console.log('view chat history:')
    console.log(viewChatHistory)
    console.log('truncate chat history:')
    console.log(truncatedChatHistoryIncSystem)
    console.log('to send:')
    console.log(toSend)

    return toSend
  }

  const executePlaylistActions = (playlistActions: PlaylistAction[]) => {
    if (playlistActions.length == 0) {
      return
    }

    // call spotify api to update playlist

    let addedTotal = 0
    let subtractedTotal = 0

    let actionPromises: Promise<any>[] = []

    actionPromises = playlistActions.map((action) => {
      const tracksPromiseArray = action.tracks.map((track) => {
        const query = encodeURIComponent(
          'album:' + track.album + ' artist:' + track.artist + ' track:' + track.track
        )

        const queryParams = 'q=' + query + '&type=track&limit=1'

        return axios
          .get('https://api.spotify.com/v1/search?' + queryParams, {
            headers: { Authorization: 'Bearer ' + accessToken },
          })
          .then((resp) => {
            if (resp.data.tracks && resp.data.tracks.items.length >= 1) {
              return resp.data.tracks.items[0].uri
            }
            return undefined
          })
      })

      // when all of the tracks have been fetched, continue
      return Promise.all(tracksPromiseArray).then((spotifyTracks) => {
        let playlistActionResponse: Promise<any> | null = null

        // filter out bad spotify responses
        const spotifyTracksFinal = spotifyTracks.filter((value) => value !== undefined)

        if (!playlistHistory || !playlistHistory[playlistHistoryIndex]) {
          console.error('Current playlist is null')
          return
        }

        if (action.actionType == 'add') {
          const spotifyAddTracksNoDups = spotifyTracksFinal.filter((track) => {
            return !playlistHistory[playlistHistoryIndex].tracks.items.some(
              (item: any) => {
                return item.track.uri == track
              }
            )
          })

          // handle invalid GPT actions
          if (spotifyAddTracksNoDups.length == 0) {
            if (playlistActions.length > 1) {
              // gpt readded existing songs after a remove op
              // we can ignore this case
            } else {
              alert(
                'DJ-GPT tried to add only invalid songs or duplicates. Please try again.'
              )
            }
          }

          console.log('adding')
          console.log(spotifyTracksFinal)
          console.log(spotifyAddTracksNoDups)
          // Add Items to Playlist
          playlistActionResponse = axios
            .post(
              'https://api.spotify.com/v1/playlists/' +
                playlistHistory[playlistHistoryIndex].id +
                '/tracks',
              {
                uris: spotifyAddTracksNoDups,
              },
              {
                headers: { Authorization: 'Bearer ' + accessToken },
              }
            )
            .then((resp) => {
              console.log('started adding')
              console.log(spotifyTracksFinal)
              setAddedNum(spotifyAddTracksNoDups.length)
              setIsModified(true)
              console.log(resp)
              console.log('finished adding')
              return
            })
        } else if (action.actionType == 'remove') {
          // Remove Playlist Items
          console.log('remove')
          const uriArr: { uri: string }[] = spotifyTracksFinal.map((track) => {
            return { uri: track }
          })
          playlistActionResponse = axios
            .delete(
              'https://api.spotify.com/v1/playlists/' +
                playlistHistory[playlistHistoryIndex].id +
                '/tracks',
              {
                headers: { Authorization: 'Bearer ' + accessToken },
                data: { tracks: uriArr },
              }
            )
            .then((resp) => {
              setSubtractedNum(spotifyTracksFinal.length)
              setIsModified(true)

              console.log(resp)
              return
            })
        } else if (action.actionType == 'replace') {
          console.log('replace')

          // Update Playlist Items
          playlistActionResponse = axios
            .put(
              'https://api.spotify.com/v1/playlists/' +
                playlistHistory[playlistHistoryIndex].id +
                '/tracks',
              { uris: spotifyTracksFinal },
              {
                headers: { Authorization: 'Bearer ' + accessToken },
              }
            )
            .then((resp) => {
              console.log(resp)
              setSubtractedNum(playlistHistory[playlistHistoryIndex].tracks.items.length)
              setAddedNum(spotifyTracksFinal.length)
              setIsModified(true)
              return
            })
        } else {
          playlistActionResponse = null
          console.error('Invalid action type: ' + action.actionType)
        }

        console.log('playlist action response')
        console.log(action)

        return playlistActionResponse
      })
    })

    Promise.all(actionPromises).then((value) => {
      console.log('final promises')
      console.log(actionPromises)
      axios
        .get(
          'https://api.spotify.com/v1/playlists/' +
            playlistHistory[playlistHistoryIndex].id,
          {
            headers: { Authorization: 'Bearer ' + accessToken },
          }
        )
        .then((resp) => {
          updatePlaylistHistory(resp.data)
          console.log('update complete')
          console.log(playlistHistory)
          console.log(playlistHistoryIndex)
          console.log(prevPlaylistHistoryIndex)
        })
    })
  }

  const onChatSubmit = async (message: string) => {
    setIsLoading(true)

    if (!openAiApi) {
      alert('Failure to load OpenAI API. Please refresh the page.')
      return
    }

    generateMessage(message).then((toSend) => {
      console.log('toSend: ' + message)
      // call openai chat api on finalMessage
      openAiApi
        .createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: toSend,
        })
        .then((resp) => {
          const responseMessage = resp.data.choices[0].message?.content
          console.log(responseMessage)

          if (responseMessage) {
            console.log('response message after ' + message + ': ')
            console.log(responseMessage)

            // set trunc chat history to keep in system prompts for GPT-3.5's context
            const { playlistActions, parsedResponseMessage } =
              parseResponse(responseMessage)

            // timeout to prevent chat for starting before the new playlist actions
            // are executed and the result is loaded
            setTimeout(() => {
              setTruncatedChatHistoryIncSystem((prevItems) => [
                ...prevItems,
                { role: Role.Assistant, content: responseMessage },
              ])
              // parse out playlist actions from the response message

              console.log('parsed response message: ')
              console.log(parsedResponseMessage)

              setViewChatHistory((prevItems) => [
                ...prevItems,
                { role: Role.Assistant, content: parsedResponseMessage },
              ])
              setIsLoading(false)
            }, 100)

            executePlaylistActions(playlistActions)

            playlistActionsNumber = playlistActions.length
          } else {
            console.log('No response message found.')
            console.log(resp.data)
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 429) {
            console.log('Too many requests made to the server, please try again later.')
            alert(
              'Too many requests made to the server, please try again. If this persists, reload.'
            )
            // Additional handling logic for 429 status here
          } else if (error.response.status === 503) {
            alert('ChatGPT is down, please try again later.')
          } else {
            console.log(error)
          }
          setIsLoading(false)
        })
    })
  }

  // diff the playlists to find newlyAdded when history changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let timeoutId: number | any = null

    const lastPlaylist = playlistHistory[prevPlaylistHistoryIndex]
    const currentPlaylist = playlistHistory[playlistHistoryIndex]

    if (lastPlaylist && currentPlaylist) {
      const diff = playlistDiff(lastPlaylist, currentPlaylist)

      console.log('the diff add is ', diff.addedTrackUris)
      setNewlyAddedSongUris(diff.addedTrackUris)
      console.log('diff: pH')
      console.log(playlistHistory)
      console.log('diff: pHI')
      console.log(playlistHistoryIndex)
      console.log('diff: prev pHI')
      console.log(prevPlaylistHistoryIndex)

      timeoutId = setTimeout(() => {
        let empty: any[] = []
        setNewlyAddedSongUris(empty)
      }, 5000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [playlistHistoryIndex])

  // update the spotify playlist to match what is showing on the screen
  // after history changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const currentPlaylist = playlistHistory[playlistHistoryIndex]
    console.log('setting spotify backend')
    if (playlistHistory.length > 0) {
      // Add Items to Playlist
      // Update Playlist Items
      // TODO: This call is unnecessary after a chat operation or a delete operation
      // it is only need after history changes
      // however, we still need to setNewlyAddedSongUris
      const apiResponse = axios
        .put(
          'https://api.spotify.com/v1/playlists/' + currentPlaylist.id + '/tracks',
          { uris: currentPlaylist.tracks.items.map((item: any) => item.track.uri) },
          {
            headers: { Authorization: 'Bearer ' + accessToken },
          }
        )
        .then((resp) => {
          axios.get('https://api.spotify.com/v1/playlists/' + currentPlaylist.id, {
            headers: { Authorization: 'Bearer ' + accessToken },
          })
        })
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

  const updatePlaylistHistory = (newPlaylist: any) => {
    if (playlistHistory.length == 0) {
      console.log('initializing history')
      setPlaylistHistory([newPlaylist])
      console.log('setting index')
      console.log(0)
      setPlaylistHistoryIndex(0)
      setPrevPlaylistHistoryIndex(0)
    } else if (playlistHistoryIndex == playlistHistory.length - 1) {
      // if we're at the front of the history and the playlist had changed
      // add the new playlist to the history
      console.log('adding to history')
      console.log(playlistHistory)
      console.log(newPlaylist)
      setPlaylistHistory([...playlistHistory, newPlaylist])
      setPrevPlaylistHistoryIndex(playlistHistoryIndex)
      console.log('setting index')
      console.log(playlistHistoryIndex + 1)
      setPlaylistHistoryIndex(playlistHistoryIndex + 1)
    } else {
      // if we're in the middle of the history and the playlist had changed
      // remove all playlists after the current index and add the new playlist
      const truncatedPlaylistHistory = playlistHistory.slice(0, playlistHistoryIndex + 1)
      setPlaylistHistory([...truncatedPlaylistHistory, newPlaylist])
      setPrevPlaylistHistoryIndex(playlistHistoryIndex)
      console.log('setting index')
      console.log(playlistHistoryIndex + 1)
      setPlaylistHistoryIndex(playlistHistoryIndex + 1)
    }
  }

  const cleanExtraNewLines = (message: string): string => {
    const pattern = /(\n\s*){3,}/g // Matches 3 or more newlines, even if separated by spaces
    const parsed1 = message.replace(pattern, '\n\n') // Replace with double new lines
    const pattern2 = /(\s*)$/ //Matches trailing newlines and spaces
    const parsed2 = parsed1.replace(pattern2, '') // Replace with no trailing newlines or spaces
    const pattern3 = /^\s+/ // Matches leading space
    const parsed3 = parsed2.replace(pattern3, '') // Replace with no leading space

    return parsed3
  }

  // trims out tokens to prevent model from overloading its ~4200 token limit
  const trimTokens = async (
    message: string,
    truncChatHistory: { role: Role; content: string }[]
  ): Promise<{ role: Role; content: string }[]> => {
    try {
      console.log('trimming tokens')
      console.log(message)
      console.log(truncChatHistory)

      const url: string = process.env.REACT_APP_OPENAI_PYTHON_API_URL + '/trim-tokens'
      console.log('url')
      console.log(url)

      const truncChatHistoryAddMessage: { role: Role; content: string }[] = [
        ...truncChatHistory,
        { role: Role.User, content: message },
      ]

      const data = {
        messages: truncChatHistoryAddMessage,
      }

      const trimmedHistory = await axios.post(url, data).then((resp) => {
        if (resp.status != 200) {
          console.error('Error trimming tokens')
          console.error(resp)

          // Fails over to keeping chat history as is - this may show the user broken
          // behavior (messages that are cut off and then no more responses)
          const truncChatHistoryDeepCopy: { role: Role; content: string }[] = [
            ...truncChatHistory,
            { role: Role.User, content: message },
          ]
          return truncChatHistoryDeepCopy
        } else {
          console.log('Trimmed tokens')
          console.log(resp.data.trimmedMessages)
          return resp.data.trimmedMessages
        }
      })
      console.log('trimmedHistory')
      console.log(trimmedHistory)
      return trimmedHistory
    } catch (e) {
      console.error(e)

      // Fails over to keeping chat history as is - this may show the user broken
      // behavior (messages that are cut off and then no more responses)
      const truncChatHistoryDeepCopy: { role: Role; content: string }[] = [
        ...truncChatHistory,
        { role: Role.User, content: message },
      ]
      return Promise.resolve(truncChatHistoryDeepCopy)
    }

    /*
    // keep the prompt
    const truncChatHistoryDeepCopy: { role: Role; content: string }[] = [
      ...truncChatHistory,
      { role: Role.User, content: message },
    ]
    return truncChatHistoryDeepCopy
    */
  }

  // TODO test this
  // parses the json object out of the response from the model
  const parseResponse = (
    responseMessage: string
  ): { playlistActions: PlaylistAction[]; parsedResponseMessage: string } => {
    try {
      const { jsonObject, beforeJson, afterJson } = splitJsonFromString(responseMessage)
      const playlistActions: PlaylistAction[] = jsonObject.actionList
      // TODO: check formatting of parsed response message
      let parsedResponseMessage = cleanExtraNewLines(beforeJson + afterJson)

      let returnMessage: string = parsedResponseMessage
      if (parsedResponseMessage.length == 0) {
        let parsedResponseMessage = 'Here you go!'
      }
      return { playlistActions, parsedResponseMessage }
    } catch (error) {
      let playlistActions: PlaylistAction[] = []
      let parsedResponseMessage = responseMessage
      return { playlistActions, parsedResponseMessage }
    }
  }

  // Utils

  // TODO: test this
  // splits out a json object from a string assuming the json object is the only one in the string
  // and there are no other instances of brackets in the string
  const splitJsonFromString = (
    input: string
  ): { jsonObject: any; beforeJson: string; afterJson: string } => {
    const openBracketIndex = input.indexOf('{')
    const closeBracketIndex = input.lastIndexOf('}')

    if (openBracketIndex === -1 || closeBracketIndex === -1) {
      throw new Error('No JSON object found in the input string')
    }

    const jsonString = input.slice(openBracketIndex, closeBracketIndex + 1)
    const beforeJson = input.slice(0, openBracketIndex)
    const afterJson = input.slice(closeBracketIndex + 1)

    let jsonObject
    try {
      jsonObject = JSON.parse(jsonString)
    } catch (error) {
      throw new Error('Invalid JSON object in the input string')
    }

    return {
      jsonObject,
      beforeJson,
      afterJson,
    }
  }

  // Styles:

  const basicStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',
    paddingTop: '20px',
    background: 'linear-gradient(to bottom right, #1a1a1a, #0e0e0e)',
  }

  const chatDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  }

  const chatDivContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    //background: 'linear-gradient(to bottom right, #f2f2f2, #000000)',
    //262626
    //1a1a1a
    // 0e0e0e
    //background: 'linear-gradient(to bottom right, #333333, #191919)',
    // background: 'linear-gradient(to bottom right, #1a1a1a, #0e0e0e)',
  }

  const spotifyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
    width: '100%',
    alignItems: 'center',
    color: 'white',
    //background: '#0e0e0e',
    //
    // #313131
  }

  const modifiedNotificationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    position: 'fixed',
    fontSize: '11px',
    bottom: '0',
    left: '0',
    right: '0',
    paddingBottom: '5px',
    paddingLeft: '10px',
    background: 'linear-gradient(to bottom, transparent, #fefefe)',
    height: '24px',
    width: '100vw',
    color: '#444654',
  }

  // TODO: flesh out chat components.
  return (
    <div
      className={'mainInterfaceContainer'}
      style={basicStyle}
      ref={mainInterfaceContainerRef}
    >
      <AuthHandler
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        refreshToken={refreshToken}
      />
      <div className={'chatDivContainer'} style={chatDivContainerStyle}>
        <div className={'chatDiv'} style={chatDivStyle}>
          <ChatVisualizer
            // slice to leave out the prompt
            chatHistory={viewChatHistory.slice(1)}
            // TODO: Fix user image url
            userImageUrl={
              'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'
            }
            isLoading={isLoading}
          />
          <ChatInput onSubmit={onChatSubmit} isLoading={isLoading} />
        </div>
      </div>
      <div className={'spotifyContainer'} style={spotifyContainerStyle}>
        <MusicPlayer
          setDeviceId={setDeviceId}
          deviceId={deviceId}
          currentTrack={''}
          tracks={{}}
          token={accessToken}
          setSpotifyPlayer={setSpotifyPlayer}
          setRerenderOnLikeTrigger={setRerenderOnLikeTrigger}
          reRenderOnLikeTrigger={rerenderOnLikeTrigger}
        />
        <div style={{ marginBottom: '30px' }}></div>
        {spotifyPlayer && (
          <PlaylistView
            token={accessToken}
            currentPlaylist={currentPlaylist}
            playlistHistory={playlistHistory}
            playlistHistoryIndex={playlistHistoryIndex}
            prevPlaylistHistoryIndex={prevPlaylistHistoryIndex}
            setPlaylistHistoryIndex={setPlaylistHistoryIndex}
            setPrevPlaylistHistoryIndex={setPrevPlaylistHistoryIndex}
            player={spotifyPlayer}
            deviceId={deviceId}
            // TODO
            newlyAddedSongUris={newlyAddedSongUris}
            setCurrentPlaylist={setCurrentPlaylist}
            updatePlaylistHistory={updatePlaylistHistory}
            rerenderOnLikeTrigger={rerenderOnLikeTrigger}
            setRerenderOnLikeTrigger={setRerenderOnLikeTrigger}
            setNewlyAddedSongUris={setNewlyAddedSongUris}
            setSubtractedNum={setSubtractedNum}
            setAddedNum={setAddedNum}
            setIsModified={setIsModified}
          />
        )}
      </div>

      {isModified && (
        <div
          className={isFading ? 'modifiedNotification fade' : 'modifiedNotification'}
          style={modifiedNotificationStyle}
          onClick={handleNotificationClick}
        >
          {numNotificationTextList}
        </div>
      )}
    </div>
  )
}
