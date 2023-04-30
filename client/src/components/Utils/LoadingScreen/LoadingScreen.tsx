import { Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import './LoadingScreen.scss'

export const LoadingScreen = () => {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="loading">
      <Spinner color="blue.500" size="xl" thickness="6px" emptyColor="#d7ecff" />
      {showMessage && (
        <div className="loading-message">
          Hmmm, it should have loaded by now...the backend is probably not properly
          connected to the frontend. Make sure that you have started your server locally
          and that it is properly connected through your
          <code>.env</code> file.
        </div>
      )}
    </div>
  )
}
