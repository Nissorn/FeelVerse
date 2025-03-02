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
    <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url("/src/assets/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Content container */}
      <div className="relative w-[100vw] h-[90vh] max-w-4xl flex items-center justify-center bg-black/0 rounded-lg p-4">
        {/* Main content area */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[10vh] right-[calc(50%-80px)] w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-80 shadow-[0_0_50px_10px_rgba(255,255,255,0.3)] animate-pulse"></div>
          <div className="absolute bottom-[5vh] left-[calc(50%-160px)] w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 opacity-80 shadow-[0_0_50px_10px_rgba(255,255,255,0.3)] animate-pulse"></div>
          {/* Add your content here */}
        </div>
      </div>
    </div>
  );
};

export default Home;