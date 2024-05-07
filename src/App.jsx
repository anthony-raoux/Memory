import React, { useState, useEffect } from 'react';
import Title from './components/Title';
import Button from './components/Button';
import Card from './components/Card'; // Importez le composant Card
import { shuffleArray } from './utils/shuffleArray'; // Importez la fonction shuffleArray
import { cardData } from './data/cardData'; // Importez les données de vos cartes
import './styles/App.css'; // Importez le fichier CSS pour l'application
import Sounds from './components/Sons';
import correctSoundFile from './audio/bonnepaire.wav';
import wrongSoundFile from './audio/mauvaisepaire.mp3';

const App = () => {
  const initialCards = shuffleArray([...cardData, ...cardData]).map((card) => ({
    ...card,
    flipped: false,
    matched: false,
  }));

  const [cards, setCards] = useState(initialCards);
  const [flippedCount, setFlippedCount] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const victorySound = new Audio('/src/audio/gagné.mp3'); // Adjust the path to your victory sound file
  const defeatSound = new Audio('/src/audio/perdu.mp3'); 
  const [correctSound] = useState(new Audio(correctSoundFile));
  const [wrongSound] = useState(new Audio(wrongSoundFile));
  const [gameWon, setGameWon] = useState(false);
  
    // Listen for changes in the gameWon state
    useEffect(() => {
      if (gameWon) {
        // Add the video-background class to the container when game is won
        document.querySelector('.container').classList.add('video-background');
      }
    }, [gameWon]);

    useEffect(() => {
      if (gameOver) {
        if (matchedCount === initialCards.length / 2) {
          setGameWon(true); // Set gameWon to true when the win condition is met
          document.querySelector('.container').classList.add('background-slide-up');
          victorySound.play();
        } else {
          defeatSound.play();
        }
      }
    }, [gameOver, matchedCount, initialCards.length]);

  useEffect(() => {
    let interval = null;
    if (isActive && !gameOver) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if ((!isActive || gameOver) && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, gameOver]);

  useEffect(() => {
    if (flippedCount === 2) {
      const flippedCards = cards.filter(card => card.flipped && !card.matched);

      if (flippedCards.length === 2) {
        const [firstCard, secondCard] = flippedCards;

        if (firstCard.id === secondCard.id) {
          const newCards = cards.map(card =>
            card.flipped && !card.matched ? { ...card, matched: true } : card
          );
          setCards(newCards);
          setMatchedCount(matchedCount + 1);
          console.log("Les cartes correspondent !");
           setTimeout(() => {
            correctSound.play();
        }, 1000); // Adjust the delay time as needed 
          
        } else {
          setTimeout(() => {
            const newCards = cards.map(card =>
              card.flipped && !card.matched ? { ...card, flipped: false } : card
            );
            setCards(newCards);
            setTries(tries + 1);
            if (tries + 1 >= 10) {
              setGameOver(true);
            }
            // Play wrong audio after a delay
            setTimeout(() => {
              wrongSound.play(); // Replace this with your wrong audio function
            }, 0); // Adjust the delay time as needed
          }, 1500);
        }
  
        setFlippedCount(0);
      }
    }

    if (matchedCount === initialCards.length / 2) {
      setGameOver(true);
    }
  }, [cards, flippedCount, matchedCount, initialCards.length, tries]);

  const handleCardClick = (index) => {
    if (!cards[index].flipped && flippedCount < 2 && !gameOver) {
      const newCards = [...cards];
      newCards[index].flipped = true;
      setCards(newCards);
      setFlippedCount(flippedCount + 1);
      setIsActive(true);
    }
  };

  const restartGame = () => {
    const shuffledCards = shuffleArray([...cardData, ...cardData]).map((card) => ({
      ...card,
      flipped: false,
      matched: false,
    }));
    setCards([]);
    setTimeout(() => {
    setCards(shuffledCards);
    setFlippedCount(0);
    setMatchedCount(0);
    setTries(0);
    setGameOver(false);
    setSeconds(0);
    setIsActive(false);
    setUsername('');
    setScoreSubmitted(false);
    }, 0); // Adjust the delay as needed
  };

  const handleSubmitScore = () => {
    setScoreSubmitted(true);
    // Enregistrez le score avec le nom d'utilisateur dans le stockage local
    const score = {
      Pseudo: username,
      Temps: seconds,
      Erreurs: tries
    };
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  return (
    <div className="container">
      <div className="header">
        <Title text="Jeu de mémoire" />
        <div className="game-info">
        {gameOver && !scoreSubmitted && (
          <div>
            <input 
              type="text" 
              placeholder="Entrez votre pseudo" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <Button text="Soumettre le score" onClick={handleSubmitScore} />
          </div>
        )}
        <div className="buttons">
          <Button text="Recommencer" onClick={restartGame} />
          <Sounds />
        </div>
      </div>
      <div className="cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            isFlipped={card.flipped}
            onClick={() => handleCardClick(index)}
            disabled={card.flipped || gameOver}
          />
        ))}
      </div>
      <div className='font'>
      {gameOver && matchedCount === initialCards.length / 2 ? (
        <div className="victory-message">Victoire! 🎉</div>
      ) : gameOver && tries >= 10 ? (
        <div className="defeat-message">Défaite! 💔</div>
      ) : null}
      <div className="info-container">
      <div>Erreurs: {tries}</div>
      <div>Temps écoulé: {seconds} secondes</div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default App;

