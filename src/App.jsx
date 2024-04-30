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
  const [matchedIndices, setMatchedIndices] = useState([]);

  useEffect(() => {
    if (flippedCount === 2) {
      const [firstIndex, secondIndex] = cards.reduce((acc, card, index) => {
        if (card.flipped) acc.push(index);
        return acc;
      }, []);
  
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
  
      // Vérifiez si les deux cartes sont retournées mais non associées
      if (firstCard.flipped && secondCard.flipped && !firstCard.matched && !secondCard.matched) {
        if (firstCard.id === secondCard.id) {
          const newCards = [...cards];
          newCards[firstIndex].matched = true;
          newCards[secondIndex].matched = true;
          setCards(newCards);
          // Incrémentation de matchedCount
          setMatchedCount(matchedCount + 1);
        } else {
          setTimeout(() => {
            const newCards = [...cards];
            newCards[firstIndex].flipped = false;
            newCards[secondIndex].flipped = false;
            setCards(newCards);
            setTries(tries + 1);
          }, 1000);
        }
      }
  
      setFlippedCount(0); // Réinitialisez le compteur de cartes retournées
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
  
      // Enregistrez l'ID de la carte sur laquelle vous avez cliqué
      const clickedCardId = newCards[index].id;
  
      // Recherchez d'autres cartes avec le même ID
      const matchingCards = newCards.filter((card) => card.id === clickedCardId && card.flipped && !card.matched);
  
      // Si une autre carte avec le même ID est trouvée, vérifiez s'ils correspondent
      if (matchingCards.length > 1) {
        const firstMatchingIndex = newCards.indexOf(matchingCards[0]);
        const secondMatchingIndex = newCards.indexOf(matchingCards[1]);
        const firstCard = newCards[firstMatchingIndex];
        const secondCard = newCards[secondMatchingIndex];
  
        // Vérifiez si les deux cartes correspondent
        if (firstCard.id === secondCard.id) {
          // Marquez les deux cartes comme associées
          newCards[firstMatchingIndex].matched = true;
          newCards[secondMatchingIndex].matched = true;
          setCards(newCards);
          // Incrémentation de matchedCount
          setMatchedCount(matchedCount + 1);
          // Ajouter les indices des cartes associées correctement à matchedIndices
          setMatchedIndices([...matchedIndices, firstMatchingIndex, secondMatchingIndex]);
        } else {
          // Les cartes ne correspondent pas, retournez-les après un court délai
          setTimeout(() => {
            newCards[firstMatchingIndex].flipped = false;
            newCards[secondMatchingIndex].flipped = false;
            setCards(newCards);
          }, 1000);
        }
      }
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
    setMatchedIndices([]);
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
            isFlipped={card.flipped} // Pass the isFlipped prop
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
