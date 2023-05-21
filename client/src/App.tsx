import React from 'react'
import { RouteContainer } from './components/RouteContainer'
import './App.scss'
import './components/Utils/Fonts/fonts.css'

const style = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

const App = () => {
  return <RouteContainer style={style} />
}

export default App
