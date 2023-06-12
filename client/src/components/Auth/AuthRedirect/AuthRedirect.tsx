import React, { useEffect } from 'react'
import axios from 'axios'
import uniqid from 'uniqid'
import querystring from 'query-string'
import { redirect } from 'react-router'

interface AuthRedirectProps {
  authEndpoint: string
  state: string
  clientId: string | undefined
  scope: string
}

export const AuthRedirect = (props: AuthRedirectProps) => {
  useEffect(() => {
    const newState = uniqid()
    // props.setState(newState)
    console.log('state is :')
    console.log(props.state)
    console.log('redirect uri is:')
    console.log(process.env.REDIRECT_URI)
    const params = {
      client_id: props.clientId,
      response_type: 'code',
      state: props.state,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      scope: props.scope,
    }
    // navigate to spotify login page
    // it will redirect to the redirect_uri with the code in the url
    const uri = window.location.replace(
      props.authEndpoint + '?' + querystring.stringify(params)
    )
  })

  return <div></div>
}
