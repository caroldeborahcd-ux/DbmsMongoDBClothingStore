import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (gender) params.set('gender', gender);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page);
        params.set('limit', 12);

        if (category) {
          const cat = categories.find(c => c.slug === category);
          if (cat) params.set('category', cat._id);
        }

        const { data } = await API.get(`/products?${params}`);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [search, category, gender, sort, minPrice, maxPrice, page, categories]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
    setPage(1);
  };

  const genders = ['Men', 'Women', 'Kids', 'Unisex'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' },
  ];

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--cream-dark)', padding: '32px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '300', marginBottom: '8px' }}>
            {search ? `Search: "${search}"` : gender ? `${gender}'s Collection` : category ? categories.find(c => c.slug === category)?.name || 'Collection' : 'All Products'}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{total} results found</div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar Filters */}
          <aside style={{ width: '220px', flexShrink: 0, background: 'var(--white)', padding: '24px', borderRadius: '2px', border: '1px solid var(--cream-dark)', position: 'sticky', top: '120px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>Filters</div>

            {/* Categories */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Category</div>
              {categories.map(cat => (
                <div key={cat._id}
                  onClick={() => updateFilter('category', category === cat.slug ? '' : cat.slug)}
                  style={{ padding: '8px 0', fontSize: '13px', cursor: 'pointer', color: category === cat.slug ? 'var(--ink)' : 'var(--ink-light)', fontWeight: category === cat.slug ? '600' : '400', borderBottom: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between' }}
                >
                  {cat.name} {category === cat.slug && <span style={{ color: 'var(--gold)' }}>✓</span>}
                </div>
              ))}
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Gender</div>
              {genders.map(g => (
                <div key={g}
                  onClick={() => updateFilter('gender', gender === g ? '' : g)}
                  style={{ padding: '8px 0', fontSize: '13px', cursor: 'pointer', color: gender === g ? 'var(--ink)' : 'var(--ink-light)', fontWeight: gender === g ? '600' : '400', borderBottom: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between' }}
                >
                  {g} {gender === g && <span style={{ color: 'var(--gold)' }}>✓</span>}
                </div>
              ))}
            </div>

            {/* Price */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Price Range</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" placeholder="Min" defaultValue={minPrice} className="form-input"
                  onBlur={e => updateFilter('minPrice', e.target.value)}
                  style={{ width: '90px', padding: '8px', fontSize: '12px' }}
                />
                <input type="number" placeholder="Max" defaultValue={maxPrice} className="form-input"
                  onBlur={e => updateFilter('maxPrice', e.target.value)}
                  style={{ width: '90px', padding: '8px', fontSize: '12px' }}
                />
              </div>
            </div>

            {(category || gender || minPrice || maxPrice) && (
              <button onClick={() => { setSearchParams({}); setPage(1); }} className="btn btn-outline" style={{ marginTop: '20px', width: '100%', fontSize: '10px', padding: '10px' }}>
                Clear Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div style={{ flex: 1 }}>
            {/* Sort */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="form-input" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? <div className="spinner" /> : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '8px' }}>No products found</div>
                <div>Try adjusting your filters</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {total > 12 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                    {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} style={{
                        width: '36px', height: '36px', borderRadius: '2px',
                        background: page === i + 1 ? 'var(--ink)' : 'var(--white)',
                        color: page === i + 1 ? 'var(--cream)' : 'var(--ink)',
                        border: '1px solid var(--cream-dark)', fontSize: '13px', cursor: 'pointer'
                      }}>{i + 1}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
