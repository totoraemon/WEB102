import './App.css';
import { useState } from 'react';

const App = () => {
  const cardSet = [
    { question: "你好 (nǐ hǎo)", answer: "hello", category: "formality" },
    { question: "谢谢 (xièxiè)", answer: "thank you", category: "formality" },
    { question: "再見 (zàijiàn)", answer: "goodbye", category: "formality" },
    { question: "對不起 (duìbuqǐ)", answer: "sorry", category: "formality" },
    { question: "請 (qǐng)", answer: "please", category: "formality" },
    { question: "我愛你 (wǒ ài nǐ)", answer: "i love you", category: "formality" },

    { question: "猫 (māo)", answer: "cat", category: "animal" },
    { question: "狗 (gǒu)", answer: "dog", category: "animal" },
    
    { question: "蘋果 (píngguǒ)", answer: "apple", category: "food-drink" },
    { question: "水 (shuǐ)", answer: "water", category: "food-drink" }
  ];

  const generateShuffledDeck = () => {
    const indexes = cardSet.map((_, index) => index);
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    return indexes;
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [navLog, setNavLog] = useState(() => generateShuffledDeck());
  const [logPointer, setLogPointer] = useState(0);

  const currentIndex = navLog[logPointer];
  const currentCard = cardSet[currentIndex];

  const handleNextCard = () => {
    if (logPointer >= cardSet.length - 1) return;
    // flip it to the front first, wait for animation, then swap data
    if (isFlipped) {
      setIsFlipped(false); // start the unflip animation
      
      setTimeout(() => {
        setLogPointer((prevPointer) => prevPointer + 1);
      }, 200);
    } else {
      // if card is already on front, swap data instantly
      setLogPointer((prevPointer) => prevPointer + 1);
    }
  };

  const handlePreviousCard = () => {
    if (logPointer === 0) return;
    setIsFlipped(false);
    setLogPointer((prevPointer) => prevPointer - 1);
  };

  const handleReset = () => {
    setIsFlipped(false);                  
    setNavLog(generateShuffledDeck());     
    setLogPointer(0);                      
  };

  return (
    <div className="App">
      <h1>Chinese Quiz</h1>
      <h2>Number of Cards: {cardSet.length}</h2>
      <h3>This is a small flashcard set covering simple Chinese phrases, written in traditional Mandarin.</h3>
      
      <div className="category-key">
        <div className="key-item">
          <span className="color-block formality-block"></span>
          Formalities
        </div>
        <div className="key-item">
          <span className="color-block animal-block"></span>
          Animals
        </div>
        <div className="key-item">
          <span className="color-block food-drink-block"></span>
          Food & Drinks
        </div>
      </div>
      
      <div className="card-container" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`card ${currentCard.category} ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <h3>{currentCard.question}</h3>
          </div>
          <div className="card-back">
            <h3>{currentCard.answer}</h3>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePreviousCard} disabled={logPointer === 0}>
          Previous
        </button>
        <button onClick={handleNextCard} disabled={logPointer === cardSet.length - 1}>
          Next
        </button>
      </div>

      <div className="reset-container">
        <button className="reset-btn" onClick={handleReset}>
          Reset Quiz
        </button>
      </div>
    </div>
  );
}

export default App;