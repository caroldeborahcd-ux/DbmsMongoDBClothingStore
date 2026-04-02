import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--ink)', color: 'var(--cream)', paddingTop: '60px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.15em', marginBottom: '16px' }}>
            Threads <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>&</span> Co
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(248,244,239,0.6)', lineHeight: '1.8' }}>
            Crafting timeless fashion for the modern soul. Quality that speaks, style that endures.
          </p>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Shop</div>
          {['Men\'s Wear', 'Women\'s Wear', 'Ethnic Wear', 'Activewear', 'Kids\' Wear'].map(item => (
            <Link key={item} to="/products" style={{ display: 'block', fontSize: '13px', color: 'rgba(248,244,239,0.7)', marginBottom: '10px', transition: 'var(--transition)' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'rgba(248,244,239,0.7)'}
            >{item}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Help</div>
          {['Size Guide', 'Track My Order', 'Returns Policy', 'Contact Us', 'FAQ'].map(item => (
            <div key={item} style={{ fontSize: '13px', color: 'rgba(248,244,239,0.7)', marginBottom: '10px', cursor: 'pointer' }}>{item}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Newsletter</div>
          <p style={{ fontSize: '13px', color: 'rgba(248,244,239,0.6)', marginBottom: '16px' }}>Get 10% off your first order. No spam, ever.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input placeholder="your@email.com" style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--cream)', fontSize: '13px', borderRadius: '2px', outline: 'none' }} />
            <button className="btn btn-gold" style={{ padding: '10px 16px', fontSize: '10px' }}>Join</button>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(248,244,239,0.4)' }}>© 2024 Threads & Co. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <span key={item} style={{ fontSize: '11px', color: 'rgba(248,244,239,0.4)', cursor: 'pointer', letterSpacing: '0.05em' }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
