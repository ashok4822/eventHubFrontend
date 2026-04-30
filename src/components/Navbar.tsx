import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Calendar } from 'lucide-react';

const Navbar = (): React.JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ position: 'fixed', top: '10px', left: '10px', right: '10px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 1000 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={18} color="white" />
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', background: 'linear-gradient(to right, white, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EventHub</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-outline">
              <LayoutDashboard size={18} />
              <span>{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="btn" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
              <LogOut size={18} color="var(--secondary)" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ border: 'none' }}>Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
