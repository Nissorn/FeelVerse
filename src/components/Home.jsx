import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url("/src/assets/home-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Content container */}
      <div className="relative w-[100vw] h-[90vh] max-w-4xl flex items-center justify-center bg-black/0 rounded-lg p-4">
        {/* Main content area */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Decorative circles */}
          {/* Interactive circle buttons */}
          <button 
            className="absolute top-[10vh] right-[calc(50%-80px)] w-20 h-20 rounded-full 
                     bg-gradient-to-tr from-[#EBE0FF] from-5% via-[#8B8B8B] via-5% to-[#1c1390] to-100% 
                     opacity-100
                     hover:bg-gradient-to-tr hover:from-[#FFFFFF] hover:via-[#EBE0FF] hover:to-[#627cf3]
                     hover:scale-110 hover:shadow-[0_0_60px_15px_rgba(255,255,255,0.4)]
                     active:scale-95 transition-all duration-300 cursor-pointer"
            onClick={() => console.log('Top circle clicked')}
            aria-label="Top circle button"
          ></button>
          <button 
            className="absolute bottom-[5vh] left-[calc(50%-175px)] w-32 h-32 rounded-full 
                     bg-gradient-to-tr from-[#8B8B8B] from-5% via-[#765ecd] via-5% to-[#716975] to-100% 
                     opacity-100
                     hover:bg-gradient-to-tr hover:from-[#A58DFB] hover:via-[#B39CF6] hover:to-[#F1E1F0]
                     hover:scale-110 hover:shadow-[0_0_60px_15px_rgba(255,255,255,0.4)]
                     active:scale-95 transition-all duration-300 cursor-pointer"
            onClick={() => console.log('Bottom circle clicked')}
            aria-label="Bottom circle button"
          ></button>
          {/* Add your content here */}
        </div>
      </div>
    </div>
  );
};

export default Home;