import React, { useState, useEffect, useRef } from 'react'
import { Role } from '../../MainInterface/MainInterface'
import ChatGptIcon from '../../Utils/Svg/chatGptIcon'
import Typist from 'react-typist'
import { preProcessFile } from 'typescript'
import './ChatVisualizer.scss'

export interface ChatVisualizerProps {
  chatHistory: { role: Role; content: string }[]
  userImageUrl: string
  isLoading: boolean
}

// to get around parallelism issues with useState
let isProgrammaticallyScrolling = false
let isScrolled = false

export const ChatVisualizer = (props: ChatVisualizerProps) => {
  // consts
  const chatVisualizerHeight = 250

  // State:
  const [chatList, setChatList] = useState<JSX.Element[]>([])
  const [lastChatRole, setLastChatRole] = useState<Role>(Role.Assistant)
  const [alternatingBackroundColor, setAlternatingBackgroundColor] =
    useState<string>('#ececf1')
  const [skippedTyping, setSkippedTyping] = useState<boolean>(false)
  const [lastSkippedLen, setLastSkippedLen] = useState<number>(0)

  // Refs:
  const chatVisualizerRef = useRef<HTMLDivElement>(null)

  const DJGPT_IMAGE_URL = ''
  // Hooks:

  // makes a typing animation wrapper for a given chat
  const makeTypingAnimation = (
    chat: {
      role: Role
      content: string
    },
    avgTypingDelay: number
  ): JSX.Element | string => {
    let componentList = []

    const arr = chat.content.match(/[^\,\:\!\.|\n]*[\,\:\!\.|\n]/g)
    // hack to get around react syntax contraints and the
    // limitations of the react-typist library
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        console.log('heres')
        if (i == 0) {
          componentList.push(<Typist.Delay ms={1000} />)
          componentList.push(arr[i])
        } else if (i == 1) {
          if (arr[i].charAt(arr.length - 1) == ',') {
            componentList.push(<Typist.Delay ms={100} />)
            componentList.push(arr[i])
          } else {
            componentList.push(<Typist.Delay ms={600} />)
            componentList.push(arr[i])
          }
        } else {
          if (arr[i].charAt(arr.length - 1) == ',') {
            componentList.push(<Typist.Delay ms={100} />)
            componentList.push(arr[i])
          } else {
            if (i < arr.length - 1 && arr[i + 1] == '\n' && arr[i] == '\n') {
              componentList.push(arr[i])
            }
            componentList.push(<Typist.Delay ms={350} />)
            componentList.push(arr[i])
          }
        }
      }

      return (
        <Typist
          cursor={{
            show: true,
            blink: true,
          }}
          avgTypingDelay={avgTypingDelay}
          onCharacterTyped={() => {
            if (!isScrolled) {
              scrollToBottom()
            }
          }}
        >
          {componentList}
        </Typist>
      )
    } else {
      return chat.content
    }
  }

  // adds a scroll listener to the chat visualizer
  useEffect(() => {
    const div = chatVisualizerRef.current
    div?.addEventListener('scroll', handleScroll)

    return () => {
      div?.removeEventListener('scroll', handleScroll)
    }
  })

  // reset skippedTyping when a new message appears
  useEffect(() => {
    if (props.chatHistory.length !== lastSkippedLen) {
      setSkippedTyping(false)
      setLastSkippedLen(props.chatHistory.length)
    }
  }, [props.chatHistory])

  // autoscroll chatbox to bottom
  useEffect(() => {
    isScrolled = false
    scrollToBottom()
  }, [chatList])

  // generate the chat list from history
  useEffect(() => {
    const chatList = props.chatHistory.map((chat, index) => {
      let localChatTextStyle = chatTextStyle
      let localChatImageContainerStyle = chatImageContainerStyle
      // typing animation for last chat or just chat.content
      let toReturn: any = chat.content

      // regular rendering
      if (index == 0) {
        localChatTextStyle = firstChatTextStyle
        localChatImageContainerStyle = firstImageContainerStyle
      }

      // set styles and for last chat item so margins are correct and make animation
      if (index == props.chatHistory.length - 1) {
        let avgTypingDelay = 35

        if (props.chatHistory.length == 0) {
          avgTypingDelay = 55
        }

        // if its loading, last message is the loading message
        // TODO: style glitch for first message when it's the only message
        if (!props.isLoading) {
          localChatTextStyle = lastChatTextStyle
          localChatImageContainerStyle = lastImageContainerStyle
          if (chat.role == Role.User) {
            // set opposite color
            setAlternatingBackgroundColor('#444654')
            toReturn = chat.content
          } else {
            setAlternatingBackgroundColor('#343641')
            // if we haven't skipped typing, render the loading animation
            if (!skippedTyping) {
              toReturn = makeTypingAnimation(chat, avgTypingDelay)
            } else {
              toReturn = chat.content
            }
          }
        }
      }
      // fix border radius bottom left and bottom right on last chat item

      if (chat.role == Role.User) {
        return (
          <div
            className="userChat"
            style={userStyle}
            key={index}
            onClick={handleSkipTyping}
          >
            <div style={localChatImageContainerStyle}>
              <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
            </div>
            <p style={localChatTextStyle}>{toReturn}</p>
          </div>
        )
      } else {
        return (
          <div
            className="assistantChat"
            style={assistantStyle}
            key={index}
            onClick={handleSkipTyping}
          >
            <div style={localChatImageContainerStyle}>
              {/*<img src={DJGPT_IMAGE_URL} alt="DJ-GPT" style={chatImageStyle} />*/}
              <ChatGptIcon style={chatImageStyle} />
            </div>
            <p style={localChatTextStyle}>{toReturn}</p>
          </div>
        )
      }
    })

    if (props.isLoading) {
      // add loading indicator
      chatList.push(
        <div className="assistantChat" style={assistantStyle} key={'loading'}>
          <div style={chatImageContainerStyle}>
            {/*<img src={DJGPT_IMAGE_URL} alt="DJ-GPT" style={chatImageStyle} />*/}
            <ChatGptIcon style={chatImageStyle} />
          </div>
          <div className="loading"></div>
        </div>
      )

      setAlternatingBackgroundColor('#343641')
    }

    setChatList(chatList)
  }, [props.chatHistory, skippedTyping])

  // Handlers:

  const handleSkipTyping = () => {
    setSkippedTyping(true)
  }

  // sets isScrolled true if user has scroleld anywhere but the bottom
  // important to allow user scrolling during navigation, but still
  // have auto scroll for typing animation
  const handleScroll = () => {
    if (chatVisualizerRef.current && !isProgrammaticallyScrolling) {
      console.log('scrollingggg')
      isScrolled = true

      if (
        chatVisualizerRef.current.scrollTop ==
        chatVisualizerRef.current.scrollHeight - chatVisualizerHeight
      ) {
        console.log('bottom scroll')
        isScrolled = false
      }
    }
  }

  const scrollToBottom = () => {
    isProgrammaticallyScrolling = true
    if (chatVisualizerRef.current) {
      chatVisualizerRef.current.scrollTop = chatVisualizerRef.current.scrollHeight
    }
    isProgrammaticallyScrolling = false
  }

  // Styles:

  const userStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#343641',
    paddingRight: '5px',
    paddingLeft: '5px',
    paddingBottom: '5px',
    paddingTop: '5px',
    color: '#ececf1',
    whiteSpace: 'pre-wrap',
  }

  const assistantStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#444654',
    paddingRight: '5px',
    paddingLeft: '5px',
    paddingBottom: '5px',
    paddingTop: '5px',
    color: '#cfd3da',
    whiteSpace: 'pre-wrap',
  }

  const lastAssistantStyle: React.CSSProperties = {
    ...assistantStyle,
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  }

  const chatVisualizerStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    height: chatVisualizerHeight.toString() + 'px',
    margin: '10px 10px 10px 10px',
    borderRadius: '10px 10px 10px 10px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
    backgroundColor: alternatingBackroundColor,
    fontSize: '12px',
    lineHeight: '1.5',
  }

  const firstChatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '15px',
    marginRight: '15px',
  }

  const lastChatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '10px',
    marginRight: '15px',
    borderRadius: '0 0 10px 10px',
  }

  const chatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '10px',
    marginRight: '20px',
  }

  const firstImageContainerStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    margin: '10px',
    marginLeft: '20px',
    marginTop: '15px',
  }

  const chatImageContainerStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    margin: '10px',
    marginLeft: '20px',
  }

  const lastImageContainerStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    margin: '10px 10px 15px 20px',
  }

  const chatImageStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '7px',
  }

  // TODO undo test
  return (
    <div className={'chatVisualizer'} style={chatVisualizerStyle} ref={chatVisualizerRef}>
      <style>
        {`
          .chatVisualizer::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {chatList}
    </div>
  )
}
