import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import gsap from 'gsap';

import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  useEffect(() => {
    // Initialize GSAP animations
    gsap.to('.stars', {
      duration: 1,
      opacity: 1,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-space-bg bg-cover bg-center overflow-hidden relative">
        {/* Background stars */}
        {/* <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="stars absolute w-1 h-1 bg-white rounded-full opacity-0"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`
              }}
            />
          ))}
        </div> */}

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
