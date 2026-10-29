import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Experience from './Experience/Experience'
import HoverMeButton from './HoverMeButton/HoverMeButton'

function App() {

  return (
    <div className='app'>
      <Experience/>
      <HoverMeButton/>
    </div>
  )
}

export default App
