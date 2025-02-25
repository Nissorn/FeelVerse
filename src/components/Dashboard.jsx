import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="p-8">
      <div className="glass-card p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-gradient text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="space-button nebula-glow px-4 py-2"
          >
            Logout
          </button>
        </div>
        <div className="text-gray-300">
          <p>Welcome to your dashboard! You're successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;