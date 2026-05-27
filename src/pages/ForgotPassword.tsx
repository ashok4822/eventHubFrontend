import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { getErrorMessage } from '../utils/error';

const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s' }} className="hover-primary">
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Login
        </Link>

        {!submitted ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Forgot Password?</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>No worries, we'll send you reset instructions.</p>
            </div>

            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="form-input" 
                    placeholder="you@example.com" 
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : <><Send size={18} style={{ marginRight: '8px' }} /> Send Reset Link</>}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>Check your email</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {message || "We've sent a password reset link to your email address."}
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn" 
              style={{ marginTop: '24px', background: 'transparent', border: '1px solid var(--border)', width: '100%' }}
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
