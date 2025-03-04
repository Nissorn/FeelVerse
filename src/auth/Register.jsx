import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

import Footer from '../components/Footer';

const Register = () => {
  useEffect(() => {
    // Animate form elements
    gsap.fromTo('.register-form',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'}
    );

    // Animate title
    gsap.fromTo('.register-title',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col mt-[-5vh]">
      <h2 className="register-title text-gradient text-3xl font-bold mb-12 mt-[-2rem]">Join the space</h2>
      {/* Glass Card Container */}
      <div className="glass-card p-8 w-[85vw] h-[70vh] max-w-md relative">
        {/* Black box container*/}
        <div className='w-[85%] max-w-[336px] h-[33vh] bg-black border border-[#50F] rounded-[20px] absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center transition-all duration-300'>
          <h1 className='text-[#4117FF] text-xl'>"Already have account?"</h1>
          <Link to="/Login">
            <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-20 py-2 bg-white text-black rounded-full hover:bg-space-star transition-colors">
                Yes
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="register-form flex flex-col opacity-0">
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-[20px] font-medium text-white mb-3 mt-3 text-center">Register</label>
              <input
                type="email"
                placeholder='Enter your email'
                className="w-full glass-card bg-black/60 text-white focus:bg-nebula-glow rounded-[30px]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder='Enter your password'
                className="w-full glass-card bg-black/60 text-white rounded-[30px]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder='Confirm your password'
                className="w-full glass-card bg-black/60 text-white rounded-[30px]"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex-grow flex items-end mb-4">
            <button type="submit" className="space-button w-full hover:nebula-glow ">
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;