import axios from 'axios';
import { useContext, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();

    // useEffect(() => {
    //   const isAuthenticated = localStorage.getItem('isAuthenticated');
    //   if (!isAuthenticated) {
    //     navigate('/');
    //   }
    // }, [navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {backendUrl} = useContext(AppContext)
  const handleOpenModal=()=>setIsModalOpen(true);
  const handleCloseModal=()=>setIsModalOpen(false);

  const handleResetPassword=()=>{
    console.log("CHECK")
    navigate('/ResetPassword');
    handleCloseModal();
  }

  const handleLogout= async ()=>{
    try{
      const {data} = await axios.post(backendUrl+'/api/auth/logout');
      if (data.success) {
        handleCloseModal();
        alert("Logged out successfully!");
        navigate('/');
      } else {
          alert("Logout failed: " + data.message);
      }
    }catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
      alert("An error occurred. Please try again.");
    } 
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url("/src/assets/home-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Content container */}
      <div className="relative w-[100vw] h-[90vh] max-w-4xl flex items-center justify-center bg-black/0 rounded-lg p-4">
        {/* Main content area */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Decorative circles */}
          {/* Interactive circle buttons */}
          <button 
            className="group absolute top-[calc(50%-33vh)] right-[calc(50%-10vh)] w-14 h-14 rounded-full 
                     bg-gradient-to-tr from-[#EBE0FF] from-5% via-[#8B8B8B] via-5% to-[#1c1390] to-100% 
                     opacity-100
                     hover:bg-gradient-to-tr hover:from-[#FFFFFF] hover:via-[#EBE0FF] hover:to-[#627cf3]
                     hover:scale-110 hover:shadow-[0_0_60px_15px_rgba(255,255,255,0.4)]
                     active:scale-95 transition-all duration-300 cursor-pointer
                     after:content-[''] after:absolute after:-bottom-16 after:left-1/2 after:-translate-x-1/2
                     after:opacity-0 after:transition-opacity after:duration-300
                     hover:after:opacity-100 hover:after:content-[attr(aria-label)]
                     animate-pulse"
            aria-label="Verse Point"
            onClick={() => navigate('/solar')}
          ></button>
          <button 
            className="group absolute bottom-[calc(50%-37vh)] left-[calc(50%-20vh)] w-20 h-20 rounded-full 
                     bg-gradient-to-tr from-[#8B8B8B] from-5% via-[#765ecd] via-5% to-[#716975] to-100% 
                     opacity-100
                     hover:bg-gradient-to-tr hover:from-[#A58DFB] hover:via-[#B39CF6] hover:to-[#F1E1F0]
                     hover:scale-110 hover:shadow-[0_0_60px_15px_rgba(255,255,255,0.4)]
                     active:scale-95 transition-all duration-300 cursor-pointer
                     after:content-[''] after:absolute after:-top-16 after:left-1/2 after:-translate-x-1/2
                     after:opacity-0 after:transition-opacity after:duration-300
                     hover:after:opacity-100 hover:after:content-[attr(aria-label)]
                     animate-pulse"
            onClick={() => navigate('/notepad')}
            aria-label="Feel Stars"
          ></button>

          <button 
            className="group absolute bottom-[calc(60%-37vh)] left-[calc(60%-20vh)] w-10 h-10 rounded-full 
                     bg-gradient-to-tr from-[#8B8B8B] from-5% via-[#5e8ecd] via-5% to-[#d2d5fa] to-100% 
                     opacity-100
                     hover:bg-gradient-to-tr hover:from-[#dbe0ff] hover:via-[#9caaf6] hover:to-[#6e6cff]
                     hover:scale-110 hover:shadow-[0_0_60px_15px_rgba(255,255,255,0.4)]
                     active:scale-95 transition-all duration-300 cursor-pointer
                     after:content-[''] after:absolute after:-top-8 after:left-1/2 after:-translate-x-1/2
                     after:opacity-0 after:transition-opacity after:duration-300
                     hover:after:opacity-100 hover:after:content-[attr(aria-label)]
                     animate-pulse"
            aria-label="Menu"
            onClick={handleOpenModal}
          ></button>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
              <button className="w-full h-full absolute bg-transparent" onClick={handleCloseModal}></button>
              <div className="glass-card rounded-2xl shadow-lg p-6 space-y-4 w-[300px]">
                <button className="w-full bg-[#a65cd1] text-white py-2 rounded-2xl" onClick={handleResetPassword}>
                  Reset Password
                </button>
                <button className="w-full mt-2 bg-[#d15c5c] text-white py-2 rounded-2xl" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default Home;