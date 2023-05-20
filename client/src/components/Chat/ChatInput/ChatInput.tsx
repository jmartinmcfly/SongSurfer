import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import SendIcon from '../../Utils/Svg/sendIcon'

interface ChatInputProps {
  onSubmit: (value: string) => void
  isLoading: boolean
}

type OverflowY =
  | 'hidden'
  | 'scroll'
  | 'auto'
  | 'visible'
  | 'inherit'
  | 'initial'
  | 'unset'

export const ChatInput = (props: ChatInputProps) => {
  const MAX_HEIGHT = 100

  // Hooks:

  const [value, setValue] = useState('')
  const [sendIconBgColor, setSendIconBgColor] = useState('transparent')
  const [sendIconSvgColor, setSendIconSvgColor] = useState('#616171')

  // text area vars
  const [height, setHeight] = useState<number>(22)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (value == '') {
      setSendIconSvgColor('#616171')
    } else {
      setSendIconSvgColor('#8e8ea0')
    }
  }, [value])

  // Event Handlers:
  const handleMouseEnterSend = () => {
    setSendIconBgColor('#202123')
  }

  const handleMouseLeaveSend = () => {
    setSendIconBgColor('transparent')
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    let tempHeight = 30
    if (textAreaRef.current) {
      // need to do this, just accessing scrollHeight from the
      // event doesn't work for some reason
      textAreaRef.current.style.height = 0 + 'px'
      tempHeight = textAreaRef.current.scrollHeight
      textAreaRef.current.style.height = Math.min(tempHeight, MAX_HEIGHT) + 'px'
    }
    setValue(value)
    setHeight(Math.min(tempHeight, MAX_HEIGHT))
  }

  const handleSubmit = (event: any) => {
    props.onSubmit(value)
    setValue('')
    setHeight(20)
  }

  // Styles:

  const sendIconStyle: React.CSSProperties = {
    height: '16px',
    width: '16px',
    margin: '5px',
    fill: sendIconSvgColor,
  }

  const whileLoadingStyle: React.CSSProperties = {
    ...sendIconStyle,
    fill: '#616171',
  }

  const sendIconDivStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: '30px',
    width: '30px',
    backgroundColor: sendIconBgColor,
    borderRadius: '20%',
    marginRight: '10px',
    marginBottom: '6px',
  }

  const chatInputStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // Note this value needs to mirror the margin for textarea and the
    // send icon
    height: (height + 20).toString() + 'px',
    marginBottom: '10px',
    backgroundColor: '#404150',
    color: '#282828',
  }

  let overflowY: CSSProperties['overflowY'] = 'hidden'
  if (height >= MAX_HEIGHT) {
    overflowY = 'scroll'
  }

  const inputStyle: React.CSSProperties = {
    width: '93%',
    height: height.toString() + 'px',
    margin: '5px',
    marginLeft: '10px',
    fontSize: '16px',
    overflowY: 'scroll',
    resize: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    //color: '#ececf1',
    color: 'white',
  }

  return (
    <div className="chatInput" style={chatInputStyle}>
      <style>
        {`
          .chatInputTextArea::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <textarea
        ref={textAreaRef}
        className="chatInputTextArea"
        value={value}
        onInput={handleInput}
        placeholder="Type your message here..."
        rows={1}
        style={inputStyle}
      />
      {!props.isLoading ? (
        <div
          onClick={handleSubmit}
          onMouseEnter={handleMouseEnterSend}
          onMouseLeave={handleMouseLeaveSend}
          style={sendIconDivStyle}
        >
          <SendIcon style={sendIconStyle} />
        </div>
      ) : (
        <div onMouseLeave={handleMouseLeaveSend} style={sendIconDivStyle}>
          <SendIcon style={whileLoadingStyle} />
        </div>
      )}
    </div>
  )
}
