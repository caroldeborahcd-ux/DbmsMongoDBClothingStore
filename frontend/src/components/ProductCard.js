import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const stars = '★'.repeat(Math.round(product.ratings?.average || 0)) + '☆'.repeat(5 - Math.round(product.ratings?.average || 0));

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to add to cart'); return; }
    setAdding(true);
    const defaultVariant = product.variants?.[0];
    const result = await addToCart(product._id, defaultVariant?.size, defaultVariant?.color);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.message);
    setAdding(false);
  };

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--white)',
          borderRadius: '2px',
          overflow: 'hidden',
          transition: 'var(--transition)',
          boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transform: hovered ? 'translateY(-4px)' : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: 'var(--cream)' }}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)'
            }}
            onError={e => { e.target.src = 'https://via.placeholder.com/400x500?text=Fashion'; }}
          />
          {discount > 0 && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--gold)', color: 'var(--ink)', fontSize: '10px', fontWeight: '700', padding: '4px 8px', letterSpacing: '0.08em' }}>
              -{discount}%
            </div>
          )}
          {product.isFeatured && (
            <div style={{ position: 'absolute', top: discount > 0 ? '40px' : '12px', left: '12px', background: 'var(--ink)', color: 'var(--cream)', fontSize: '9px', fontWeight: '600', padding: '4px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Featured
            </div>
          )}
          {/* Quick add */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(26,26,26,0.85)', padding: '12px',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
          }}>
            <button onClick={handleQuickAdd} disabled={adding} style={{
              width: '100%', padding: '10px', background: 'var(--gold)', color: 'var(--ink)',
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase',
              border: 'none', cursor: 'pointer', borderRadius: '1px'
            }}>
              {adding ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px' }}>
          {product.brand && (
            <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '4px' }}>
              {product.brand}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: '400', marginBottom: '6px', lineHeight: '1.3', color: 'var(--ink)' }}>
            {product.name}
          </div>
          {product.ratings?.count > 0 && (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '11px' }}>{stars}</span>
              <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>({product.ratings.count})</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600', color: 'var(--ink)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {product.variants?.slice(0, 4).map((v, i) => v.color && (
              <span key={i} title={v.color} style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: v.colorHex || '#ccc',
                border: '1.5px solid var(--cream-dark)',
                display: 'inline-block'
              }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
