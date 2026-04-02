import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  if (!user) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>Sign in to view your cart</div>
      <Link to="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );

  if (cart.items.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'var(--cream)' }}>
      <div style={{ fontSize: '64px' }}>🛍</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '300' }}>Your cart is empty</div>
      <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 0' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: '300', marginBottom: '40px' }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          {/* Items */}
          <div>
            {cart.items.map(item => (
              <div key={item._id} style={{ background: 'var(--white)', borderRadius: '2px', padding: '24px', marginBottom: '12px', display: 'flex', gap: '20px', border: '1px solid var(--cream-dark)' }}>
                <div style={{ width: '96px', height: '120px', flexShrink: 0, borderRadius: '2px', overflow: 'hidden', background: 'var(--cream)' }}>
                  <img src={item.product?.images?.[0] || 'https://via.placeholder.com/100x120?text=Fashion'}
                    alt={item.product?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.src = 'https://via.placeholder.com/100x120?text=Fashion'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '6px' }}>{item.product?.name || item.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px', display: 'flex', gap: '12px' }}>
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', border: '1px solid var(--cream-dark)', background: 'var(--cream)' }}>
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeFromCart(item._id)}
                        style={{ width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: 'var(--ink-light)' }}>−</button>
                      <div style={{ width: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>{item.quantity}</div>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: 'var(--ink-light)' }}>+</button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ color: 'var(--ink-muted)', fontSize: '18px', alignSelf: 'flex-start', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--error)'}
                  onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
                >✕</button>
              </div>
            ))}
            <Link to="/products" style={{ fontSize: '12px', color: 'var(--ink-muted)', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>← Continue Shopping</Link>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '2px', border: '1px solid var(--cream-dark)', position: 'sticky', top: '120px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '24px' }}>Order Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--cream-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink-light)' }}>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink-light)' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--ink)' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.04em' }}>Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '12px' }}>
              Proceed to Checkout
            </button>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              {['UPI', 'Card', 'COD', 'NetBanking'].map(m => (
                <span key={m} style={{ fontSize: '10px', padding: '4px 8px', background: 'var(--cream)', borderRadius: '2px', color: 'var(--ink-muted)' }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
