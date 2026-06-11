import './App.css';
import {useState} from 'react';
import samosa from './assets/samosa.webp';

const App = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const updateCount = () => setCount(count + multiplier); 

  // checkpoint 5 (stretch): count is updated after purchases
  const buyDoubleStuffed = () => {
    if (count >= 10) {
      setMultiplier(multiplier * 2);
      setCount(count - 10);
    }
  }
  const buyPartyPack = () => {
    if (count >= 100) {
      setMultiplier(multiplier * 5);
      setCount(count - 100);
    }
  }
  const buyFullFeast = () => {
    if (count >= 1000) {
      setMultiplier(multiplier * 100);
      setCount(count - 1000);
    }
  }

  // personal stretch: reset count and multiplier to 0 and 1 respectively
  const resetCount = () => {
    setCount(0);
    setMultiplier(1);
  }

  return (
    <div className="App">
      <h1>Samosa Selector</h1>
      <button onClick={resetCount}>Reset Count</button>
      <h2>Count: {count}</h2>
      
      <img className="samosa" src={samosa} alt="Samosa" onClick={updateCount} draggable='false'></img>

      <div className="container">
        <div className="upgrade">
          <h3>Double Stuffed 👯‍♀️</h3>
          <p>2x per click</p>
          <button onClick={buyDoubleStuffed}>10 samosas</button>
        </div>

        <div className="upgrade">
          <h3>Party Pack 🎉</h3>
          <p>5x per click</p>
          <button onClick={buyPartyPack}>100 samosas</button>
        </div>

        <div className="upgrade">
          <h3>Full Feast 👩🏽‍🍳</h3>
          <p>10x per click</p>
          <button onClick={buyFullFeast}>1000 samosas</button>
        </div>
      </div>
    </div>
  )
}

export default App