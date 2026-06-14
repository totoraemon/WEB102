import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Calendar from './components/Calendar'

const App = () => {

  return (
    <div className="App">
      <h1>Itinerary for 7 Days in Taiwan 🇹🇼</h1>
      <h2>Welcome to Taiwan! Take a look at this calendar to find where to sightsee and eat!</h2>
      <Calendar />
    </div>
  )
}

export default App