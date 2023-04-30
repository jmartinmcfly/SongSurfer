import React, { useEffect } from 'react'
import axios from 'axios'
import uniqid from 'uniqid'
import querystring from 'query-string'

interface AuthRedirectProps {
  authEndpoint: string
  state: string
  clientId: string | undefined
  scope: string
  redirectUri: string
}

export const AuthRedirect = (props: AuthRedirectProps) => {
  useEffect(() => {
    const newState = uniqid()
    // props.setState(newState)
    console.log('state is :')
    console.log(props.state)
    const params = {
      client_id: props.clientId,
      response_type: 'code',
      state: props.state,
      redirect_uri: props.redirectUri,
      scope: props.scope,
    }
    const uri = window.location.replace(
      props.authEndpoint + '?' + querystring.stringify(params)
    )
  })

  return <div>Redirecting to Spotify</div>
}
