import React, { useState, useEffect, useRef } from 'react'
import { Role } from '../../MainInterface/MainInterface'
import ChatGptIcon from '../../Utils/Svg/chatGptIcon'

export interface ChatVisualizerProps {
  chatHistory: { role: Role; content: string }[]
  userImageUrl: string
}

export const ChatVisualizer = (props: ChatVisualizerProps) => {
  // State:
  const [chatList, setChatList] = useState<JSX.Element[]>([])
  const [lastChatRole, setLastChatRole] = useState<Role>(Role.Assistant)
  const [alternatingBackroundColor, setAlternatingBackgroundColor] =
    useState<string>('#ececf1')

  // Refs:
  const chatVisualizerRef = useRef<HTMLDivElement>(null)

  const DJGPT_IMAGE_URL = ''
  // Hooks:

  // autoscroll chatbox to bottom
  useEffect(() => {
    if (chatVisualizerRef.current) {
      chatVisualizerRef.current.scrollTop = chatVisualizerRef.current.scrollHeight
    }
  }, [chatList])

  // generate the chat list from history
  useEffect(() => {
    const chatList = props.chatHistory.map((chat, index) => {
      let localChatTextStyle = chatTextStyle
      let localChatImageContainerStyle = chatImageContainerStyle

      if (index == 0) {
        localChatTextStyle = firstChatTextStyle
        localChatImageContainerStyle = firstImageContainerStyle
      }

      if (index == props.chatHistory.length - 1) {
        console.log('last')
        localChatTextStyle = lastChatTextStyle
        localChatImageContainerStyle = lastImageContainerStyle
        if (chat.role == Role.User) {
          // set opposite color
          setAlternatingBackgroundColor('#444654')
        } else {
          setAlternatingBackgroundColor('#343641')
        }
      }

      // TODO: START HERE
      // fix border radius bottom left and bottom right on last chat item

      if (chat.role == Role.User) {
        return (
          <div className="userChat" style={userStyle} key={index}>
            <div style={localChatImageContainerStyle}>
              <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
            </div>
            <div style={localChatTextStyle}>{chat.content}</div>
          </div>
        )
      } else {
        return (
          <div className="assistantChat" style={assistantStyle} key={index}>
            <div style={localChatImageContainerStyle}>
              {/*<img src={DJGPT_IMAGE_URL} alt="DJ-GPT" style={chatImageStyle} />*/}
              <ChatGptIcon style={chatImageStyle} />
            </div>
            <div style={localChatTextStyle}>{chat.content}</div>
          </div>
        )
      }
    })

    setChatList(chatList)
  }, [props.chatHistory])

  // Styles:

  const userStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#343641',
    paddingRight: '5px',
    paddingLeft: '5px',
    color: '#ececf1',
  }

  const lastUserStyle: React.CSSProperties = {
    ...userStyle,
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  }

  const assistantStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#444654',
    paddingRight: '5px',
    paddingLeft: '5px',
    color: '#cfd3da',
  }

  const lastAssistantStyle: React.CSSProperties = {
    ...assistantStyle,
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  }

  const chatVisualizerStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    height: '250px',
    margin: '10px',
    borderRadius: '10px 10px 0px 10px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
    backgroundColor: alternatingBackroundColor,
  }

  const firstChatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '20px',
    marginBottom: '10px',
    marginRight: '15px',
  }

  const chatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '10px',
    marginBottom: '10px',
    marginRight: '20px',
  }

  const lastChatTextStyle: React.CSSProperties = {
    marginLeft: '5px',
    marginTop: '10px',
    marginBottom: '20px',
    marginRight: '15px',
    borderRadius: '0 0 10px 10px',
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
