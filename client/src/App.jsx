import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import gsap from 'gsap';

import Login from './auth/Login.jsx';
import EmailVerify from './auth/EmailVerify.jsx';
import Register from './auth/Register.jsx';
import Home from './components/Home.jsx';
import Solar from './components/Solar.jsx';
import Note from './components/Note.jsx';
import Notepad from './components/Notepad.jsx';

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
      <div className="fixed inset-0 w-full h-full bg-space-bg bg-cover bg-center bg-no-repeat">
        {/* Main content */}
        <div className="relative z-10 min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/solar" element={<Solar />} />
            <Route path="/note/:date" element={<Note />} />
            <Route path="/notepad" element={<Notepad />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
