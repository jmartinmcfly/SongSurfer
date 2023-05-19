import React from 'react'
import { RouteContainer } from './components/RouteContainer'
import './App.scss'

const style = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

const App = () => {
  return <RouteContainer style={style} />
}

export default App
