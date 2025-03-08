import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Solar = () => {
  const navigate = useNavigate();
  const [selectedCircle, setSelectedCircle] = useState(1);
  const [slideDirection, setSlideDirection] = useState('none');

  // Mood colors mapping (this would typically come from backend)
  // Mood colors mapping with default color
  const defaultColor = '#4A90E2'; // use this color for color that not use 
  const moodColors = {
    January: '#4A90E2',    // Example: Calm/Neutral
    February: '#D64545',   // Example: Angry/Intense
    March: '#45B7D6',      // Example: Peaceful
    April: '#98D645',      // Example: Happy
    May: '#D6A345',        // Example: Anxious
    June: '#9945D6',       // Example: Creative
    July: '#D64599',       // Example: Passionate
    August: '#45D682',     // Example: Refreshed
    September: '#8B572A',  // Example: Stressed
    October: '#7ED321',    // Example: Energetic
    November: '#F5A623',   // Example: Mixed
    December: '#4A4A4A'    // Example: Melancholic
  };

  //Create 12 circle for each month
  const circles = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * 30) * (Math.PI / 180);
    const radius = 200;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[index];
    return {
      id: index + 1,
      x,
      y,
      month,
      color: moodColors[month] // Use mood color from mapping
    };
  });

  const handleCircleClick = (id) => {
    setSlideDirection(id > selectedCircle ? 'slide-left' : 'slide-right');
    setSelectedCircle(id);
  };

  const handleNavigation = (direction) => {
    const totalCircles = circles.length;
    let newId;
    
    if (direction === 'left') {
      newId = selectedCircle === 1 ? totalCircles : selectedCircle - 1;
    } else {
      newId = selectedCircle === totalCircles ? 1 : selectedCircle + 1;
    }
    
    setSlideDirection(direction === 'right' ? 'slide-left' : 'slide-right');
    setSelectedCircle(newId);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideDirection('none');
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCircle]);

  // Get previous and next circle indices with wrap-around
  const prevCircleIndex = selectedCircle === 1 ? circles.length - 1 : selectedCircle - 2;
  const nextCircleIndex = selectedCircle === circles.length ? 0 : selectedCircle;

  const [isHolding, setIsHolding] = useState(false);
  const [showSolarText, setShowSolarText] = useState(false);

  const handlePressStart = () => {
    setIsHolding(true);
    setTimeout(() => {
      if (isHolding) {
        setShowSolarText(true);
      }
    }, 1000);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
    setShowSolarText(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black/0 overflow-hidden">
      {/*Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-transparent backdrop-blur-sm">
        <button
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex items-center justify-center transition-all duration-300 hover:scale-110"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <span className="text-2xl text-white">←</span>
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 hover:scale-110"
          aria-label="Menu"
        >
          <span className="w-4 h-[2px] bg-white"></span>
          <span className="w-4 h-[2px] bg-white"></span>
          <span className="w-4 h-[2px] bg-white"></span>
        </button>
      </div>
      {/* Main display area with circles */}
      <div className="relative w-full max-w-[1200px] h-[600px] flex items-center justify-center mb-8 px-4 sm:px-8 md:px-12">
        {/* Navigation buttons for medium and larger screens */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNavigation('left')}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                       flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Previous circle"
          >
            <span className="text-2xl text-white">←</span>
          </button>
          <button
            onClick={() => handleNavigation('right')}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                       flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Next circle"
          >
            <span className="text-2xl text-white">→</span>
          </button>
        </div>

        {/* Circle display area */}
        <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto">
          {/* Previous circle (smaller and less opaque) */}
          <div
            className="w-[80px] h-[80px] sm:w-40 sm:h-40 rounded-full transition-all duration-500 transform opacity-40 mr-4 sm:mr-16 relative"
            style={{
              background: `linear-gradient(135deg, ${circles[prevCircleIndex].color}, rgba(28, 19, 144, 0.8))`,
              boxShadow: `0 0 40px 10px ${circles[prevCircleIndex].color}40`
            }}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/60 text-sm sm:text-base font-medium">
              {circles[prevCircleIndex].month}
            </span>
          </div>
          
          {/* Large active circle */}

          <div
            className={`w-[120px] h-[120px] sm:w-64 sm:h-64 rounded-full transition-all duration-500 transform hover:scale-105 ${slideDirection} relative`}
            style={{
              background: `linear-gradient(135deg, ${circles[selectedCircle - 1].color}, rgba(28, 19, 144, 0.8))`,
              boxShadow: `0 0 80px 20px ${circles[selectedCircle - 1].color}60`
            }}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/80 text-lg sm:text-2xl font-bold">
              {circles[selectedCircle - 1].month}
            </span>
            {showSolarText && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-bold transition-opacity duration-300">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#EBE0FF]">
                  Solar
                </span>
              </div>
            )}
          </div>

          {/* Next circle (smaller and less opaque) */}
          <div
            className="w-[80px] h-[80px] sm:w-40 sm:h-40 rounded-full transition-all duration-500 transform opacity-40 ml-4 sm:ml-16 relative"
            style={{
              background: `linear-gradient(135deg, ${circles[nextCircleIndex].color}, rgba(28, 19, 144, 0.8))`,
              boxShadow: `0 0 40px 10px ${circles[nextCircleIndex].color}40`
            }}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/60 text-sm sm:text-base font-medium">
              {circles[nextCircleIndex].month}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom selection menu */}
      {/* Navigation buttons for small screens - moved to bottom */}
      <div className="md:hidden flex justify-center gap-4 mb-4 px-4 fixed bottom-20 left-0 right-0 z-10">
        <button
          onClick={() => handleNavigation('left')}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Previous circle"
        >
          <span className="text-2xl text-white">←</span>
        </button>
        <button
          onClick={() => handleNavigation('right')}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Next circle"
        >
          <span className="text-2xl text-white">→</span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-4">
        <div 
          className="flex justify-start items-center gap-3 sm:gap-4 overflow-x-auto py-2 px-4 max-w-4xl mx-auto snap-x snap-mandatory touch-pan-x"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            paddingLeft: 'calc(50% - 24px)',
            paddingRight: 'calc(50% - 24px)'
          }}
        >
          {circles.map(({ id, color, month }) => (
            <button
              key={`menu-${id}`}
              className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300
                        hover:scale-110 ${selectedCircle === id ? 'ring-2 ring-white scale-110' : ''} relative snap-center`}
              style={{
                background: `linear-gradient(135deg, ${color}, rgba(28, 19, 144, 0.8))`,
                boxShadow: `0 0 20px 5px ${color}30`
              }}
              onClick={() => handleCircleClick(id)}
              aria-label={`Select ${month}`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white/80 text-[8px] sm:text-[10px] font-medium pointer-events-none">
                {month.slice(0, 3)}
              </span>
            </button>
          ))}        
        </div>
        <style jsx>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <style jsx>{`
        .slide-left {
          animation: slideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-right {
          animation: slideRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideLeft {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Solar;