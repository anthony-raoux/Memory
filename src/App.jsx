import React, { useState, useEffect } from 'react';
import Title from './components/Title';
import Button from './components/button';
import Card from './components/card'; // Importez le composant Card
import { shuffleArray } from './utils/shuffleArray'; // Importez la fonction shuffleArray
import { cardData } from './data/cardData'; // Importez les données de vos cartes
import './App.css'; // Importez le fichier CSS pour l'application

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
        } else {
          setTimeout(() => {
            const newCards = cards.map(card =>
              card.flipped && !card.matched ? { ...card, flipped: false } : card
            );
            setCards(newCards);
            setTries(tries + 1);
          }, 1000);
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
    }
  };

  const restartGame = () => {
    const shuffledCards = shuffleArray([...cardData, ...cardData]).map((card) => ({
      ...card,
      flipped: false,
      matched: false,
    }));
    setCards(shuffledCards);
    setFlippedCount(0);
    setMatchedCount(0);
    setTries(0);
    setGameOver(false);
  };

  return (
    <div className="container">
      <div className="header">
        <Title text="Jeu de mémoire" />
        <Button text="Recommencer" onClick={restartGame} />
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
      {gameOver && <div>Victoire! 🎉</div>}
      <div>Tries: {tries}</div>
    </div>
  );
};

export default App;
