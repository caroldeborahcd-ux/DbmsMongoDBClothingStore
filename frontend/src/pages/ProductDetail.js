import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
        if (prodRes.data.variants?.length > 0) {
          setSelectedSize(prodRes.data.variants[0].size);
          setSelectedColor(prodRes.data.variants[0].color);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add to cart'); navigate('/login'); return; }
    setAdding(true);
    const result = await addToCart(product._id, selectedSize, selectedColor, quantity);
    if (result.success) toast.success('Added to cart! 🛍');
    else toast.error(result.message);
    setAdding(false);
  };

  const uniqueColors = [...new Set(product?.variants?.map(v => v.color).filter(Boolean))];
  const uniqueSizes = [...new Set(product?.variants?.map(v => v.size).filter(Boolean))];
  const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

  if (loading) return <div className="spinner" style={{ marginTop: '100px' }} />;
  if (!product) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Product not found</div>;

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ position: 'relative', paddingBottom: '120%', background: 'var(--white)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
              <img src={product.images?.[activeImage] || 'https://via.placeholder.com/600x720?text=Fashion'}
                alt={product.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.src = 'https://via.placeholder.com/600x720?text=Fashion'}
              />
              {discount > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--gold)', color: 'var(--ink)', fontSize: '12px', fontWeight: '700', padding: '6px 12px' }}>-{discount}% OFF</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImage(i)}
                    style={{ width: '80px', height: '80px', borderRadius: '2px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImage === i ? 'var(--gold)' : 'transparent'}` }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.brand && <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '8px' }}>{product.brand}</div>}
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: '300', marginBottom: '16px', lineHeight: '1.1' }}>{product.name}</h1>

            {product.ratings?.count > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '14px' }}>{stars(product.ratings.average)}</span>
                <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{product.ratings.average} ({product.ratings.count} reviews)</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '400' }}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && <span style={{ fontSize: '18px', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>}
              {discount > 0 && <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600' }}>Save {discount}%</span>}
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--ink-light)', marginBottom: '32px' }}>{product.description}</p>

            {/* Color */}
            {uniqueColors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Color: <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {uniqueColors.map(color => {
                    const v = product.variants?.find(va => va.color === color);
                    return (
                      <div key={color} onClick={() => setSelectedColor(color)} title={color}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: v?.colorHex || '#ccc', cursor: 'pointer', border: `3px solid ${selectedColor === color ? 'var(--ink)' : 'transparent'}`, outline: selectedColor === color ? '1px solid var(--ink)' : 'none', outlineOffset: '2px' }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {uniqueSizes.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Size</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uniqueSizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      style={{
                        width: '48px', height: '48px', borderRadius: '2px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                        background: selectedSize === size ? 'var(--ink)' : 'var(--white)',
                        color: selectedSize === size ? 'var(--cream)' : 'var(--ink)',
                        border: `1px solid ${selectedSize === size ? 'var(--ink)' : 'var(--cream-dark)'}`,
                        transition: 'var(--transition)'
                      }}
                    >{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
              <div style={{ display: 'flex', border: '1px solid var(--cream-dark)', background: 'var(--white)' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '40px', height: '48px', fontSize: '18px', cursor: 'pointer', color: 'var(--ink-light)' }}>−</button>
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>{quantity}</div>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: '40px', height: '48px', fontSize: '18px', cursor: 'pointer', color: 'var(--ink-light)' }}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary" style={{ flex: 1, padding: '14px 24px' }}>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Product details */}
            <div style={{ borderTop: '1px solid var(--cream-dark)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {product.material && <div style={{ fontSize: '13px' }}><span style={{ fontWeight: '600', letterSpacing: '0.06em' }}>Material:</span> <span style={{ color: 'var(--ink-light)' }}>{product.material}</span></div>}
              {product.gender && <div style={{ fontSize: '13px' }}><span style={{ fontWeight: '600', letterSpacing: '0.06em' }}>Gender:</span> <span style={{ color: 'var(--ink-light)' }}>{product.gender}</span></div>}
              {product.category?.name && <div style={{ fontSize: '13px' }}><span style={{ fontWeight: '600', letterSpacing: '0.06em' }}>Category:</span> <span style={{ color: 'var(--ink-light)' }}>{product.category.name}</span></div>}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: '300', marginBottom: '32px' }}>Customer Reviews</h2>
          {reviews.length === 0 ? (
            <div style={{ padding: '40px', background: 'var(--white)', borderRadius: '2px', textAlign: 'center', color: 'var(--ink-muted)' }}>
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background: 'var(--white)', padding: '24px', borderRadius: '2px', border: '1px solid var(--cream-dark)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{r.user?.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div style={{ color: 'var(--gold)', marginBottom: '8px' }}>{stars(r.rating)}</div>
                  {r.title && <div style={{ fontWeight: '600', marginBottom: '4px' }}>{r.title}</div>}
                  <p style={{ fontSize: '13px', color: 'var(--ink-light)', lineHeight: '1.7' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
