import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) { toast.success('Welcome back!'); navigate('/'); }
    else toast.error(result.message);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '12px' }}>THREADS & CO</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: '300' }}>Welcome Back</h1>
        </div>
        <div style={{ background: 'var(--white)', padding: '40px', borderRadius: '2px', border: '1px solid var(--cream-dark)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--gold)', marginBottom: '8px', letterSpacing: '0.08em' }}>Demo: admin@threads.com / admin123</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '20px', borderTop: '1px solid var(--cream-dark)', fontSize: '13px', color: 'var(--ink-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--ink)', fontWeight: '600', borderBottom: '1px solid var(--gold)' }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) { toast.success('Account created! Welcome!'); navigate('/'); }
    else toast.error(result.message);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '12px' }}>THREADS & CO</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: '300' }}>Join Us</h1>
        </div>
        <div style={{ background: 'var(--white)', padding: '40px', borderRadius: '2px', border: '1px solid var(--cream-dark)' }}>
          <form onSubmit={handleSubmit}>
            {[{ key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9876543210' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' }
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="form-input" placeholder={placeholder} required={key !== 'phone'} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--cream-dark)', fontSize: '13px', color: 'var(--ink-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--ink)', fontWeight: '600', borderBottom: '1px solid var(--gold)' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
