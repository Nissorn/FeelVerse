import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import gsap from 'gsap';
import Login from './auth/Login.jsx';
import EmailVerify from './auth/EmailVerify.jsx';
import ResetPassword from './auth/ResetPassword.jsx';
import Register from './auth/Register.jsx';
import Home from './components/Home.jsx';
import Solar from './components/Solar.jsx';
import Note from './components/Note.jsx';
import Notepad from './components/Notepad.jsx';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log("ProtectedRoute checked. isAuthenticated =", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

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
            <Route path="/register" element={<Register />} />
            <Route path="/email-verify" element={<EmailVerify />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/ResetPassword" element={<ResetPassword/>} />
                <Route path="/home" element={<Home />} />
                <Route path="/solar" element={<Solar />} />
                <Route path="/note/:date" element={<Note />} />
                <Route path="/notepad" element={<Notepad />} />
              </Route>
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
