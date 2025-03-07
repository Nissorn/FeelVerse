import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Solar = () => {
  const navigate = useNavigate();
  const [selectedCircle, setSelectedCircle] = useState(1);
  const [slideDirection, setSlideDirection] = useState('none');

  // Generate positions for 12 circles in a circular pattern
  const circles = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * 30) * (Math.PI / 180);
    const radius = 200;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return {
      id: index + 1,
      x,
      y,
      month: months[index],
      color: `hsl(${index * 30}, 70%, 60%)`
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black/0 overflow-hidden">
      {/* Navigation buttons for small screens */}
      <div className="md:hidden flex justify-center gap-4 mb-4 px-4">
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
              background: `linear-gradient(135deg, ${circles[prevCircleIndex].color}, #1c1390)`,
              boxShadow: '0 0 40px 10px rgba(255,255,255,0.2)'
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
              background: `linear-gradient(135deg, ${circles[selectedCircle - 1].color}, #1c1390)`,
              boxShadow: '0 0 80px 20px rgba(255,255,255,0.3)'
            }}
          >
            {/* Inner glow effect */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-white text-xl sm:text-2xl font-bold">
              {circles[selectedCircle - 1].month}
            </span>
          </div>

          {/* Next circle (smaller and less opaque) */}
          <div
            className="w-[80px] h-[80px] sm:w-40 sm:h-40 rounded-full transition-all duration-500 transform opacity-40 ml-4 sm:ml-16 relative"
            style={{
              background: `linear-gradient(135deg, ${circles[nextCircleIndex].color}, #1c1390)`,
              boxShadow: '0 0 40px 10px rgba(255,255,255,0.2)'
            }}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/60 text-sm sm:text-base font-medium">
              {circles[nextCircleIndex].month}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom selection menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-4">
        <div className="flex justify-center items-center gap-3 sm:gap-4 overflow-x-auto py-2 px-4 max-w-4xl mx-auto">
          {circles.map(({ id, color, month }) => (
            <button
              key={`menu-${id}`}
              className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300
                        hover:scale-110 ${selectedCircle === id ? 'ring-2 ring-white scale-110' : ''} relative`}
              style={{
                background: `linear-gradient(135deg, ${color}, #1c1390)`
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