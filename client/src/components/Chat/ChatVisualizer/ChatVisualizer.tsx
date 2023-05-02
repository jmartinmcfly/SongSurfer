import React, { useState, useEffect } from 'react'

enum Role {
  User = 'user',
  Assistant = 'assistant',
}

interface ChatVisualizerProps {
  chatHistory: { role: Role; content: string }[]
  userImageUrl: string
}

export const ChatVisualizer = (props: ChatVisualizerProps) => {
  // State:
  const [chatList, setChatList] = useState<JSX.Element[]>([])

  const DJGPT_IMAGE_URL = ''
  // Hooks:

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
        localChatTextStyle = lastChatTextStyle
        localChatImageContainerStyle = lastImageContainerStyle
      }

      if (chat.role == Role.User) {
        return (
          <div className="userChat" style={userStyle}>
            <div style={localChatImageContainerStyle}>
              <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
            </div>
            <div style={localChatTextStyle}>{chat.content}</div>
          </div>
        )
      } else {
        return (
          <div className="assistantChat" style={assistantStyle}>
            <div style={localChatImageContainerStyle}>
              <img src={DJGPT_IMAGE_URL} alt="DJ-GPT" style={chatImageStyle} />
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

  const chatVisualizerStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    height: '300px',
    margin: '10px',
    borderRadius: '10px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
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
    margin: '10px',
    marginLeft: '20px',
    marginBottom: '15px',
  }

  const chatImageStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
  }

  // TODO undo test
  return (
    <div className={'chatVisualizer'} style={chatVisualizerStyle}>
      <style>
        {`
          .chatVisualizer::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{"Hi! I'm DJ-GPT, your personal DJ assistant."}</div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Hi, can you make me tango playlist?'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>
          {
            "Sure, heres's a playlist I made for you. It's full of great tunes for you to dance to. I've included music from several different countries, artists, and substyles of tango. It starts upbeat and then slows down near the end."
          }
        </div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Thanks!'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{"Hi! I'm DJ-GPT, your personal DJ assistant."}</div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Hi, can you make me tango playlist?'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>
          {
            "Sure, heres's a playlist I made for you. It's full of great tunes for you to dance to. I've included music from several different countries, artists, and substyles of tango. It starts upbeat and then slows down near the end."
          }
        </div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Thanks!'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{"Hi! I'm DJ-GPT, your personal DJ assistant."}</div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Hi, can you make me tango playlist?'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>
          {
            "Sure, heres's a playlist I made for you. It's full of great tunes for you to dance to. I've included music from several different countries, artists, and substyles of tango. It starts upbeat and then slows down near the end."
          }
        </div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Thanks!'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{"Hi! I'm DJ-GPT, your personal DJ assistant."}</div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>{'Hi, can you make me tango playlist?'}</div>
      </div>
      <div className="assistantChat" style={assistantStyle}>
        <div style={chatImageContainerStyle}>
          <img src={props.userImageUrl} alt="DJ-GPT" style={chatImageStyle} />
        </div>
        <div style={chatTextStyle}>
          {
            "Sure, heres's a playlist I made for you. It's full of great tunes for you to dance to. I've included music from several different countries, artists, and substyles of tango. It starts upbeat and then slows down near the end."
          }
        </div>
      </div>
      <div className="userChat" style={userStyle}>
        <div style={lastImageContainerStyle}>
          <img src={props.userImageUrl} alt="User" style={chatImageStyle} />
        </div>
        <div style={lastChatTextStyle}>{'Thanks!'}</div>
      </div>
    </div>
  )
}
