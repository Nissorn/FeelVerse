import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Notepad = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [text, setText] = useState('');
  const squareRef = useRef(null);

  useEffect(() => {
    if (showSquare) {
      gsap.fromTo(squareRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
  }, [showSquare]);

  const handleImageClick = () => {
    setShowSquare(true);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setShowSquare(false);
  };

  const handleTurnInClick = (e) => {
    e.stopPropagation();
    alert('Turned in');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="group relative w-[90vw] h-[90vh] max-w-4xl flex items-center justify-center rounded-lg">
        <div className={`relative w-full h-full rounded-lg transition-all duration-300 ease-in-out ${ //Background image
            !showSquare ? 'group-hover:shadow-glow group-hover:scale-105' : ''
          }`}
          style={{
            backgroundImage: 'url("/src/assets/note_page1.png")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={handleImageClick}
        >
          {showSquare && (
            <>
              <div ref={squareRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-3/4 bg-[#d4d4d4] border border-black flex flex-col items-center justify-center">
                <textarea //Text area
                  className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none text-black"
                  value={text}
                  onChange={handleTextChange}
                />
              </div>
              <button
                className="absolute top-4 left-1/3 transform -translate-x-1/2 bg-[#d4d4d4] text-black rounded px-4 py-2"
                onClick={handleCloseClick}
              >
                Close
              </button>

              <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#d4d4d4] text-black rounded px-4 py-2"
                onClick={handleTurnInClick}
              >
                Turn in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notepad;