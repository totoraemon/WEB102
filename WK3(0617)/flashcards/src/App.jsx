import './App.css';
import { useState } from 'react';

const CARD_SET = [
  { question: "What does CPU stand for?", answer: "Central Processing Unit", category: "processing" },
  { question: "What does GPU stand for?", answer: "Graphics Processing Unit", category: "processing" },
  { question: "What does RAM stand for?", answer: "Random Access Memory", category: "memory" },
  { question: "What does SSD stand for?", answer: "Solid State Drive", category: "storage" },
  { question: "What does HDD stand for?", answer: "Hard Disk Drive", category: "storage" },
  { question: "What is used to provide text input to a computer?", answer: "keyboard", category: "external" },
  { question: "What is used to provide cursor input to a computer?", answer: "mouse or touchpad", category: "external" },
  { question: "What is used to provide audio output to a user?", answer: "speakers", category: "external" },
  { question: "What is used to provide audio input to a computer?", answer: "microphone", category: "external" },
  { question: "What type of headwear combines headphones and a microphone?", answer: "headset", category: "external" }
];

// default deck for standard to allow for shuffling of deck
const generateDefaultDeck = () => CARD_SET.map((_, index) => index);

const CategoryKey = () => (
  <div className="category-key">
    <div className="key-item"><span className="color-block processing-block"></span>Processing</div>
    <div className="key-item"><span className="color-block memory-block"></span>Memory</div>
    <div className="key-item"><span className="color-block storage-block"></span>Storage</div>
    <div className="key-item"><span className="color-block external-block"></span>External</div>
  </div>
);

const FlashCard = ({ card, isFlipped, onClick, onTransitionEnd }) => (
  <div className="card-container" onClick={onClick}>
    <div className={`card ${card.category} ${isFlipped ? 'flipped' : ''}`} onTransitionEnd={onTransitionEnd}>
      <div className="card-front">
        <h3>{card.question}</h3>
      </div>
      <div className="card-back">
        <h3>{card.answer}</h3>
      </div>
    </div>
  </div>
);

const Controls = ({ onPrev, onNext, onShuffle, onReset, isFirst, isLast, isAnimating }) => (
  <>
    <div className="navigation-buttons">
      <button onClick={onPrev} disabled={isFirst || isAnimating}>
        Previous
      </button>
      <button className="shuffle-btn" onClick={onShuffle}>
        🔀 Shuffle Deck
      </button>
      <button onClick={onNext} disabled={isLast || isAnimating}>
        Next
      </button>
    </div>
    <div className="reset-container">
      <button className="reset-btn" onClick={onReset}>Reset Order</button>
    </div>
  </>
);

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [navLog, setNavLog] = useState(() => generateDefaultDeck());
  const [logPointer, setLogPointer] = useState(0);
  const [pendingDirection, setPendingDirection] = useState(null);
  
  const [userGuess, setUserGuess] = useState('');
  const [guessStatus, setGuessStatus] = useState(null); 
  
  // counter variables for streaks
  const [currStreak, setCurrStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const currentIndex = navLog[logPointer];
  const currentCard = CARD_SET[currentIndex];

  const clearInputForm = () => {
    setUserGuess('');
    setGuessStatus(null);
  };

  const handleNextCard = () => {
    if (logPointer >= CARD_SET.length - 1) return;
    clearInputForm();
    if (isFlipped) {
      setPendingDirection('next');
      setIsFlipped(false);
    } else {
      setLogPointer((prev) => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (logPointer === 0) return;
    clearInputForm();
    if (isFlipped) {
      setPendingDirection('prev');
      setIsFlipped(false);
    } else {
      setLogPointer((prev) => prev - 1);
    }
  };

  const handleAnimationEnd = () => {
    if (pendingDirection === 'next') {
      setLogPointer((prev) => prev + 1);
    } else if (pendingDirection === 'prev') {
      setLogPointer((prev) => prev - 1);
    }
    setPendingDirection(null);
  };

  const handleShuffleDeck = () => {
    setIsFlipped(false);
    setPendingDirection(null);
    clearInputForm();
    
    const shuffled = [...navLog];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setNavLog(shuffled);
    setLogPointer(0);
  };

  const handleReset = () => {
    setIsFlipped(false);                  
    setNavLog(generateDefaultDeck());     
    setLogPointer(0);     
    setPendingDirection(null);
    clearInputForm();
    
    // reset streaks when user selects reset button
    setCurrStreak(0);
    setLongestStreak(0);
  };

  const handleCheckGuess = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    const sanitizedUserGuess = userGuess.toLowerCase().trim();
    const sanitizedActualAnswer = currentCard.answer.toLowerCase();

    // accounts for answers that are within the actual answer (e.g. counts mouse OR touchpad)
    if (sanitizedActualAnswer.includes(sanitizedUserGuess)) {
      setGuessStatus('correct');
      const nextStreak = currStreak + 1;
      setCurrStreak(nextStreak);
      
      if (nextStreak > longestStreak) {
        setLongestStreak(nextStreak);
      }
    } else {
      setGuessStatus('incorrect');
      setCurrStreak(0);
    }
  };

  return (
    <div className="App">
      <h1>PC Components</h1>
      <h2>Card {logPointer + 1} of {CARD_SET.length}</h2>
      <h3>Submit your guess into the input box below before seeing the flipside of a card!</h3>
      <h4>Current Streak: {currStreak} | Longest Streak: {longestStreak}</h4>
      
      <CategoryKey />
      
      <FlashCard 
        card={currentCard} 
        isFlipped={isFlipped} 
        onClick={() => setIsFlipped(!isFlipped)} 
        onTransitionEnd={handleAnimationEnd} 
      />

      <form onSubmit={handleCheckGuess} className="guess-container">
        <label htmlFor="guess-input" className="visually-hidden">Guess abbreviation meaning:</label>
        <input 
          id="guess-input"
          type="text" 
          placeholder="Type what it stands for..." 
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
        />
        <button type="submit" className="submit-guess-btn">Submit Guess</button>
        
        {guessStatus === 'correct' && (
          <p className="feedback-text correct-msg">✅ That is correct!</p>
        )}
        {guessStatus === 'incorrect' && (
          <p className="feedback-text incorrect-msg">❌ That is incorrect. Try again or click to flip!</p>
        )}
      </form>

      <Controls 
        onPrev={handlePreviousCard}
        onNext={handleNextCard}
        onShuffle={handleShuffleDeck}
        onReset={handleReset}
        isFirst={logPointer === 0}
        isLast={logPointer === CARD_SET.length - 1}
        isAnimating={pendingDirection !== null}
      />
    </div>
  );
}

export default App;