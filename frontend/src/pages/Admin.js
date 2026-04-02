import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    const load = async () => {
      try {
        const [ordRes, prodRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products?limit=100')
        ]);
        const allOrders = ordRes.data;
        setOrders(allOrders);
        setProducts(prodRes.data.products);
        setStats({
          orders: allOrders.length,
          products: prodRes.data.total,
          revenue: allOrders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalAmount, 0),
          pending: allOrders.filter(o => o.orderStatus === 'Placed').length
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [user, navigate]);

  const statusColors = { Placed: '#f39c12', Confirmed: '#2980b9', Shipped: '#16a085', Delivered: '#27ae60', Cancelled: '#c0392b' };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '80px' }} />;

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '8px' }}>ADMIN PANEL</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '300' }}>Dashboard</h1>
          </div>
          <Link to="/" className="btn btn-outline" style={{ fontSize: '10px' }}>← Back to Store</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Products', value: stats.products, icon: '👗', color: '#8e44ad' },
            { label: 'Total Orders', value: stats.orders, icon: '📦', color: '#2980b9' },
            { label: 'Pending Orders', value: stats.pending, icon: '⏳', color: '#f39c12' },
            { label: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#27ae60' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--white)', padding: '24px', borderRadius: '2px', border: '1px solid var(--cream-dark)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: s.color, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--white)', padding: '4px', borderRadius: '2px', width: 'fit-content', border: '1px solid var(--cream-dark)' }}>
          {['overview', 'orders', 'products'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase',
              background: tab === t ? 'var(--ink)' : 'transparent',
              color: tab === t ? 'var(--cream)' : 'var(--ink-muted)',
              borderRadius: '2px', transition: 'var(--transition)', cursor: 'pointer', border: 'none'
            }}>{t}</button>
          ))}
        </div>

        {/* Orders Tab */}
        {(tab === 'overview' || tab === 'orders') && (
          <div style={{ background: 'var(--white)', borderRadius: '2px', border: '1px solid var(--cream-dark)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--cream-dark)', fontFamily: 'var(--font-display)', fontSize: '22px' }}>
              {tab === 'overview' ? 'Recent Orders' : 'All Orders'}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--cream)' }}>
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'left', borderBottom: '1px solid var(--cream-dark)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(tab === 'overview' ? orders.slice(0, 8) : orders).map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--gold)' }}>{order.orderNumber?.slice(-8)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{order.user?.name || 'N/A'}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink-muted)' }}>{order.items.length} items</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: order.paymentStatus === 'Paid' ? '#27ae6020' : '#f39c1220', color: order.paymentStatus === 'Paid' ? '#27ae60' : '#f39c12' }}>{order.paymentStatus}</span></td>
                      <td style={{ padding: '14px 16px' }}>
                        <select value={order.orderStatus} onChange={e => updateStatus(order._id, e.target.value)}
                          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '2px', border: `1px solid ${statusColors[order.orderStatus] || '#ccc'}`, color: statusColors[order.orderStatus] || 'var(--ink)', background: `${statusColors[order.orderStatus] || '#ccc'}15`, fontWeight: '600', cursor: 'pointer' }}>
                          {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px' }}><Link to={`/orders/${order._id}`} style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600' }}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div style={{ background: 'var(--white)', borderRadius: '2px', border: '1px solid var(--cream-dark)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>All Products</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--cream)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'left', borderBottom: '1px solid var(--cream-dark)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                      <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '56px', borderRadius: '2px', overflow: 'hidden', background: 'var(--cream)', flexShrink: 0 }}>
                          <img src={p.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/44x56'} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{p.gender}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ink-muted)' }}>{p.category?.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>₹{p.price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        <span style={{ color: p.totalStock > 5 ? 'var(--success)' : p.totalStock > 0 ? '#f39c12' : 'var(--error)', fontWeight: '600' }}>{p.totalStock}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: p.isActive ? '#27ae6020' : '#e7404020', color: p.isActive ? '#27ae60' : '#c0392b' }}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
