import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState({
    fullName: user?.name || '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: user?.phone || ''
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  const handlePlace = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product._id, name: i.product.name, image: i.product.images?.[0],
        size: i.size, color: i.color, price: i.price, quantity: i.quantity
      }));
      const { data } = await API.post('/orders', {
        items, shippingAddress: address, paymentMethod,
        subtotal: cartTotal, shippingCost: shipping, discount: 0, totalAmount: total
      });
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (cart.items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 0' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: '300', marginBottom: '40px' }}>Checkout</h1>
        <form onSubmit={handlePlace}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
            <div>
              {/* Shipping */}
              <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '2px', border: '1px solid var(--cream-dark)', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Shipping Address</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { key: 'fullName', label: 'Full Name', full: true },
                    { key: 'phone', label: 'Phone Number', full: true },
                    { key: 'street', label: 'Street Address', full: true },
                    { key: 'city', label: 'City' }, { key: 'state', label: 'State' },
                    { key: 'zipCode', label: 'ZIP Code' }, { key: 'country', label: 'Country' },
                  ].map(({ key, label, full }) => (
                    <div key={key} style={full ? { gridColumn: '1 / -1' } : {}}>
                      <label className="form-label">{label}</label>
                      <input value={address[key]} onChange={e => setAddress({ ...address, [key]: e.target.value })}
                        className="form-input" required />
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment */}
              <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '2px', border: '1px solid var(--cream-dark)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Payment Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {['COD', 'UPI', 'Card', 'NetBanking'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: paymentMethod === m ? 'var(--cream)' : 'var(--white)', border: `1.5px solid ${paymentMethod === m ? 'var(--gold)' : 'var(--cream-dark)'}`, borderRadius: '2px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                      <input type="radio" value={m} checked={paymentMethod === m} onChange={e => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--gold)' }} />
                      {m === 'COD' ? '💵' : m === 'UPI' ? '📱' : m === 'Card' ? '💳' : '🏦'} {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '2px', border: '1px solid var(--cream-dark)', position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '20px' }}>Your Order</div>
              {cart.items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--cream-dark)' }}>
                  <div style={{ width: '56px', height: '70px', background: 'var(--cream)', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.product?.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/56x70'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{item.size} · {item.color} · Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--ink-light)' }}>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--ink-light)' }}>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '22px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--cream-dark)' }}>
                  <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button type="submit" disabled={placing} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px' }}>
                {placing ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Orders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    API.get('/orders/myorders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColors = { Placed: '#f39c12', Confirmed: '#2980b9', Processing: '#8e44ad', Shipped: '#16a085', 'Out for Delivery': '#27ae60', Delivered: '#27ae60', Cancelled: '#c0392b', Returned: '#7f8c8d' };

  if (loading) return <div className="spinner" style={{ marginTop: '80px' }} />;

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 0' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: '300', marginBottom: '40px' }}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--white)', borderRadius: '2px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '8px' }}>No orders yet</div>
            <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</button>
          </div>
        ) : orders.map(order => (
          <div key={order._id} onClick={() => navigate(`/orders/${order._id}`)}
            style={{ background: 'var(--white)', borderRadius: '2px', padding: '24px', marginBottom: '12px', border: '1px solid var(--cream-dark)', cursor: 'pointer', transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '2px' }}>{order.orderNumber}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px', background: `${statusColors[order.orderStatus]}20`, color: statusColors[order.orderStatus] }}>{order.orderStatus}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} style={{ width: '48px', height: '60px', background: 'var(--cream)', borderRadius: '2px', overflow: 'hidden' }}>
                  <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/48x60'} />
                </div>
              ))}
              {order.items.length > 3 && <div style={{ width: '48px', height: '60px', background: 'var(--cream-dark)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--ink-muted)' }}>+{order.items.length - 3}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
