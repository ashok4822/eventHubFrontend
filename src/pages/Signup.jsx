import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join EventHub and start booking your dream services</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} style={{ marginRight: '4px' }} /> Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: '4px' }} /> Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="john@example.com" />
          </div>

          <div className="form-group">
            <label><Lock size={14} style={{ marginRight: '4px' }} /> Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label><ShieldCheck size={14} style={{ marginRight: '4px' }} /> I am a...</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ flex: 1, padding: '12px', background: formData.role === 'user' ? 'var(--primary)' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', color: formData.role === 'user' ? 'white' : 'var(--text-muted)' }}>
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleInputChange} style={{ display: 'none' }} />
                User
              </label>
              <label style={{ flex: 1, padding: '12px', background: formData.role === 'admin' ? 'var(--secondary)' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', color: formData.role === 'admin' ? 'white' : 'var(--text-muted)' }}>
                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleInputChange} style={{ display: 'none' }} />
                Admin
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
