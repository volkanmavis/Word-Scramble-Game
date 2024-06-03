import React, { useState, useEffect } from 'react';
import './App.css';
import './Start-button.css';
import NewGame from './New-game';

function App() {
  const [gameState, setGameState] = useState({
    onPlay: false,
    inputValue: "",
    message: "",
    correctWord: "",
    scrambledWord: ""
  });

  const handleButtonClick = () => {
    const { inputValue, correctWord } = gameState;
    if (inputValue !== "") {
      const message = correctWord === inputValue ? "Correct Answer" : "Wrong Answer";
      setGameState({ ...gameState, message });
    }
  };

  const handleInputChange = (event) => {
    setGameState({ ...gameState, inputValue: event.target.value });
  };

  const selectWord = async () => {
    try {
      const response = await fetch(`https://random-word-api.herokuapp.com/word`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      return data[0].toUpperCase();
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  const handleStartGame = async () => {
    const word = await selectWord();
    const scrambledWord = createScrambledWord(word);
    setGameState({
      onPlay: true,
      inputValue: "",
      message: "",
      correctWord: word,
      scrambledWord
    });
  };

  const createScrambledWord = (word) => {
    const shuffledArray = word.split('').sort(() => Math.random() - 0.5);
    return shuffledArray.join('');
  };

  useEffect(() => {
    let clearMessage;
    if (gameState.message === "Wrong Answer") {
      clearMessage = setTimeout(() => setGameState({ ...gameState, message: "" }), 800);
    }
    return () => {
      if (clearMessage) {
        clearTimeout(clearMessage);
      }
    };
  }, [gameState.message]);

  const { onPlay, inputValue, message, correctWord, scrambledWord } = gameState;

  return (
    <div className='word-app'>
      <div className='heading-container'>
        <h1 className='heading'>Welcome to Word App</h1>
      </div>
      
      <div className='content'>
        <div className='message-container'>
          {message && 
            <div className='message'>
              <p>{message}</p>
            </div>
          }
        </div>
      
        {onPlay ? (
          <>
            <div className='board'>
              {correctWord.split('').map((letter, index) => (
                <div key={index} className='letter-box'>{inputValue[index]}</div>
              ))}
            </div>
            <p className='scrambled-word'>{scrambledWord}</p>
            <div className='field'>
              <input type="text" placeholder='Any guess?' className='app-input' onChange={handleInputChange} value={inputValue.toUpperCase()}/>
              <button type='button' className='enter-button' onClick={handleButtonClick}>
                <span class="back-enter"></span>
                <span class="front-enter"></span>
              </button>
            </div>
          </>
        ) : (
          <button className='button-51' onClick={handleStartGame}>Start Game</button>
        )}
        {onPlay && (
          <NewGame onClick={() => setGameState({ ...gameState, onPlay: false })}/>
        )}
      </div>
    </div>
  );
}

export default App;
