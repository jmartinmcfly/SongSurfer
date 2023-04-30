import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import SendIcon from '../../Utils/Svg/sendIcon'

interface ChatInputProps {
  onSubmit: (value: string) => void
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
  const [height, setHeight] = useState<number>(30)
  const textAreaRef = useRef<React.RefObject<HTMLTextAreaElement> | null>(null)

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
    const { scrollHeight, value } = e.target
    setValue(value)
    setHeight(Math.min(scrollHeight, MAX_HEIGHT))
    console.log(scrollHeight)
  }

  // TODO
  const handleSubmit = (event: any) => {
    props.onSubmit(value)
  }

  // Styles:

  const sendIconStyle: React.CSSProperties = {
    height: '16px',
    width: '16px',
    margin: '5px',
    fill: sendIconSvgColor,
  }

  const sendIconDivStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: sendIconBgColor,
    borderRadius: '20%',
    marginRight: '10px',
  }

  const chatInputStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    height: height.toString() + 'px',
    marginBottom: '10px',
    backgroundColor: '#404150',
    color: '#404150',
  }

  let overflowY: CSSProperties['overflowY'] = 'hidden'
  if (height >= MAX_HEIGHT) {
    overflowY = 'scroll'
  }

  // TODO scroll
  const inputStyle: React.CSSProperties = {
    height: height.toString() + 'px',
    overflowY: 'scroll',
    resize: 'none',
    width: '93%',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    color: '#ececf1',
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
        className="chatInputTextArea"
        value={value}
        onInput={handleInput}
        placeholder="Type your message here..."
        style={inputStyle}
      />
      <div
        onClick={handleSubmit}
        onMouseEnter={handleMouseEnterSend}
        onMouseLeave={handleMouseLeaveSend}
        style={sendIconDivStyle}
      >
        <SendIcon style={sendIconStyle} />
      </div>
    </div>
  )
}
