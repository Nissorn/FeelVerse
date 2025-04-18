import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

import Footer from '../components/Footer';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin } = useContext(AppContext);
  
  useEffect(() => {
    localStorage.setItem('isAuthenticated', false);
    
    // Animate welcome text
    gsap.fromTo('.welcome-text', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
    );

    // Animate glass card
    gsap.fromTo('.glass-card',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
    );

    // Animate black box
    gsap.fromTo('.black-box',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1, delay: 1, ease: 'back.out' }
    );
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError('');
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      }, { withCredentials: true });

      if (data.success) {
        console.log("complete");
        setIsLoggedin(true);
        localStorage.setItem('isAuthenticated', true);
        navigate('/home');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col mt-[-5vh]">
      <h2 className="welcome-text text-white text-3xl font-bold mb-12 mt-[-2rem] relative z-10">Welcome</h2>

      {/* Glass card container */}

      <div className="glass-card p-8 w-[85vw] h-[70vh] max-w-md relative ">
        
        {/* Black box container with signup link */}
        <div className="black-box w-[85%] max-w-[336px] h-[33vh] bg-black border border-[#50F] rounded-[20px] absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center transition-all duration-300 z-10 opacity-0">
          <h1 className="text-[#4117FF] text-xl">"No account yet"</h1>
          <button 
            onClick={() => {
              // Animate black box down with smoother transition
              gsap.to('.black-box', {
                y: '55vh',
                duration: 1.6,
                ease: 'power4.inOut'
              });
              
              // Fade out login form
              gsap.to('.login-form', {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut',
                delay: 0.1,
                onComplete: () => {
                  setTimeout(() => {
                    navigate('/register');
                  }, 800);
                }
              });
            }} 
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-20 py-2 bg-white text-black rounded-full hover:bg-space-star transition-colors"
          >
            Yes
          </button>
        </div>
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="login-form flex flex-col mt-[30vh] space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-[20px] font-medium text-white mb-1 text-center">Login</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full glass-card bg-black/35 text-white rounded-[30px]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full glass-card bg-black/35 text-white rounded-[30px]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Forgot password */}
          <button 
            onClick={() => navigate('/ResetPassword')} 
            className="register-form text-[15px] font-medium text-blue-500 mt-1 ml-2 text-start"
          >
            Forgot password
          </button>
          
          {/* Sign In button */}
          <div className="mt-4">
            <button 
              type="submit" 
              className="space-button w-full hover:nebula-glow"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {/* Error message under Sign In button */}
          {error && (
            <div className="text-center text-white bg-red-500/100  px-3 py-1 rounded-md mx-20 mt-4">
              {error}
            </div>
          )}
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
