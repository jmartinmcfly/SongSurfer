import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface MainInterfaceProps {
  state: string
}

// TODO: Get an auth token and display profile data
export const MainInterface = (props: MainInterfaceProps) => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const code = params.get('code')

  // grab auth token, repeat this every 15 minutes
  // grab profile data once we have an auth token
  useEffect(() => {})

  return <div> {'hi' + code} </div>
}
