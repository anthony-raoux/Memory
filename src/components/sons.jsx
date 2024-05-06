import React, { useState, useEffect } from 'react';

const Sounds = () => {
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false); 

  useEffect(() => {
    const audio = new Audio('/src/audio/musicdefond.mp3');
    setBackgroundMusic(audio);
    audio.loop = true;

    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundMusic) {
      if (isSoundOn) {
        backgroundMusic.play();
      } else {
        backgroundMusic.pause();
      }
    }
  }, [isSoundOn, backgroundMusic]);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  return (
    <div>
      <button onClick={toggleSound}>
        {isSoundOn ? 'Désactiver la musique' : 'Activer la musique'}
      </button>
    </div>
  );
};

export default Sounds;
