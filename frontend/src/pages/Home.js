import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?featured=true&limit=8'),
          API.get('/categories')
        ]);
        setFeatured(prodRes.data.products);
        setCategories(catRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const heroBanners = [
    { label: 'New Season', title: 'Summer\nCollection', subtitle: '2024', bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', accent: '#c9a96e', link: '/products?sort=newest' },
  ];

  const catIcons = { "Men's Wear": '👔', "Women's Wear": '👗', "Kids' Wear": '🧒', 'Ethnic Wear': '🪷', 'Activewear': '🏃', 'Accessories': '👜' };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={{ minHeight: '82vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2018 60%, #1a1a1a 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(201,169,110,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden', opacity: 0.3 }}>
          <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800) center/cover' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>New Arrivals · Summer 2024</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: '300', color: 'var(--cream)', lineHeight: '1.0', marginBottom: '32px' }}>
              Wear Your<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Story</em>
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(248,244,239,0.6)', maxWidth: '400px', lineHeight: '1.8', marginBottom: '40px' }}>
              Curated fashion for every chapter of your life. Quality fabrics, timeless silhouettes, modern sensibility.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-gold" style={{ fontSize: '11px' }}>Shop Collection</Link>
              <Link to="/products?gender=Women" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--cream)', fontSize: '11px', letterSpacing: '0.12em' }}>Women's Edit</Link>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '32px' }}>
          {[['500+', 'Styles'], ['50+', 'Brands'], ['10K+', 'Happy Customers']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--gold)', fontWeight: '300' }}>{n}</div>
              <div style={{ fontSize: '10px', color: 'rgba(248,244,239,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Browse By</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '300' }}>Shop Categories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat.slug}`}
                style={{
                  background: 'var(--white)',
                  borderRadius: '2px',
                  padding: '32px 20px',
                  textAlign: 'center',
                  transition: 'var(--transition)',
                  border: '1px solid var(--cream-dark)',
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.borderColor = 'var(--ink)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--cream-dark)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{catIcons[cat.name] || '🧥'}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: '400', marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase' }}>Shop Now →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Handpicked</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '300' }}>Featured Pieces</h2>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ fontSize: '10px' }}>View All</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Value Props Banner */}
      <section style={{ background: 'var(--ink)', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              ['🚚', 'Free Delivery', 'On orders above ₹999'],
              ['↩️', 'Easy Returns', '30-day hassle-free returns'],
              ['✅', 'Genuine Products', '100% authentic merchandise'],
              ['🔒', 'Secure Payments', 'UPI, Card, COD accepted'],
            ].map(([icon, title, sub]) => (
              <div key={title}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--cream)', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(248,244,239,0.5)', letterSpacing: '0.05em' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
