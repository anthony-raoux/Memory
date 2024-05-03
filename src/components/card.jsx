import React, { useState } from 'react';
import '../styles/Card.css';

const Card = ({ card, isFlipped, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const flipSound = new Audio('/src/audio/carte.mp3'); // Importez votre fichier audio

  const handleCardClick = () => {
    if (!isAnimating && !isFlipped) {
      setIsAnimating(true);
      flipSound.play(); // Jouez le son lorsque la carte est retournée
      setTimeout(() => {
        setIsAnimating(false);
        onClick();
      }, 100); // Durée de l'animation en millisecondes
    }
    console.log("ID de la carte:", card.id); // Affichage de l'ID de la carte
  };

  return (
    <div
      className={`card card-component ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-inner">
        <div className="card-front">
          {isFlipped && card.image && <img src={card.image} alt="Card" />} {/* Affiche l'image si elle est définie */}
        </div>
        <div className="card-back">
          <img src="/src/images/cardback.avif" alt="Card Back" /> {/* Image de fond de la face arrière */}
          <div>{card.content}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;

