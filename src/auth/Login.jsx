import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Here you would typically make an API call to your backend
      // For demonstration, we'll simulate an authentication check
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Store auth token or user data in localStorage/context
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
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
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h2 className="text-white text-3xl font-bold mb-12 mt-[-2rem]">Welcome</h2>
      <div className="glass-card p-8 w-full h-[70vh] max-w-md relative">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {/* Black box container positioned to overlap with glass-card */}
        <div className='w-[85%] max-w-[336px] h-[30vh] bg-black rounded-[20px] absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center transition-all duration-300'>
          <h1 className='text-gray-700 text-xl'>"No account yet"</h1>
          <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-20 py-2 bg-white text-black rounded-full hover:bg-space-star transition-colors">
            Yes
          </button>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-[25vh]">
          <div>
            <label className="block text-sm font-medium text-white mb-1 text-center">Login</label>
            <input
              type="email"
              placeholder='Enter your email'
              className="w-full glass-card bg-black/60 text-white focus:bg-nebula-glow rounded-[30px]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="space-button w-full"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-center text-[10px]">
            <Link to="/forgot-password" className="text-white hover:text-nebula-glow transition-colors">
              Forgot your Password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-space-nebula hover:text-space-star transition-colors">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
      <footer>
        <p className="text-white text-center mt-16 text-[10px]">
          &copy; {new Date().getFullYear()} Feel Verse. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;