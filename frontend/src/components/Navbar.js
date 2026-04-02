import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'New Arrivals', to: '/products?sort=newest' },
    { label: 'Women', to: '/products?gender=Women' },
    { label: 'Men', to: '/products?gender=Men' },
    { label: 'Ethnic', to: '/products?category=ethnic-wear' },
    { label: 'Active', to: '/products?category=activewear' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(248,244,239,0.97)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--cream-dark)' : 'transparent'}`,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        {/* Top bar */}
        <div style={{ background: 'var(--ink)', color: 'var(--cream)', textAlign: 'center', padding: '8px', fontSize: '11px', letterSpacing: '0.12em' }}>
          FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; EASY 30-DAY RETURNS
        </div>

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '68px' }}>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }} className="hamburger">
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '22px', height: '1.5px', background: 'var(--ink)', transition: 'var(--transition)' }} />)}
          </button>

          {/* Logo */}
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '300', letterSpacing: '0.15em', color: 'var(--ink)', textTransform: 'uppercase' }}>
            Threads <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>&</span> Co
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} style={{
                fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--ink-light)', transition: 'var(--transition)', padding: '4px 0',
                borderBottom: location.search.includes(link.to.split('?')[1] || '') ? '1px solid var(--gold)' : '1px solid transparent'
              }}
                onMouseEnter={e => e.target.style.color = 'var(--ink)'}
                onMouseLeave={e => e.target.style.color = 'var(--ink-light)'}
              >{link.label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ fontSize: '18px', color: 'var(--ink-light)', transition: 'var(--transition)' }}
              onMouseEnter={e => e.target.style.color = 'var(--ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-light)'}
            >⌕</button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>Admin</Link>
                )}
                <Link to="/profile" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={logout} style={{ fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.08em' }}>Sign out</button>
              </div>
            ) : (
              <Link to="/login" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>Sign In</Link>
            )}

            <Link to="/cart" style={{ position: 'relative', fontSize: '20px', color: 'var(--ink)', display: 'flex' }}>
              🛍
              {cartCount > 0 && (
                <span className="badge" style={{ position: 'absolute', top: '-8px', right: '-10px', fontSize: '9px' }}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--cream-dark)', background: 'var(--white)' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', gap: '12px' }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products, styles, brands..."
                className="form-input" autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--white)', borderTop: '1px solid var(--cream-dark)', padding: '20px 24px' }}>
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} style={{ display: 'block', padding: '12px 0', fontSize: '13px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--cream-dark)', color: 'var(--ink)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div style={{ height: '108px' }} />

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
