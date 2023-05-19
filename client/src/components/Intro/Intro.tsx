import React, { useState, useEffect } from 'react'
import Typist from 'react-typist'
import { useNavigate } from 'react-router-dom'
import './Intro.scss'

export interface IntroProps {}

/**
 * This is the button component. It responds to an onClick event.
 *
 * @param props: IButtonProps
 * @returns Button component
 */
export const Intro = (props: IntroProps): JSX.Element => {
  const [typingDone, setTypingDone] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()

  // handlers
  const handleClick = () => {
    navigate('/auth')
  }

  // styles

  const introContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    color: 'white',
    fontSize: '36px',
    background: 'linear-gradient(to bottom right, #1a1a1a, #0e0e0e)',
  }

  const introStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '80%',
    marginTop: '200px',
    marginBottom: '10px',
  }

  const exploreStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '80%',
  }

  return (
    <div style={introContainerStyle}>
      <div style={introStyle}>
        <Typist
          onTypingDone={() => setTypingDone(true)}
          cursor={{
            show: true,
            blink: true,
          }}
        >
          Welcome to SoundSurfer,
          <Typist.Delay ms={100} /> a Natural Language Interface for Playlist Creation.
        </Typist>
      </div>

      {typingDone && (
        <div onClick={handleClick} className={'exploreText'} style={exploreStyle}>
          <Typist
            onTypingDone={() => setTypingDone(true)}
            cursor={{
              show: true,
              blink: true,
            }}
          >
            Login with Spotify to Begin
          </Typist>
        </div>
      )}
    </div>
  )
}
