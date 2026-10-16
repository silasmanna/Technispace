import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const TYPES = ['All', 'Studio', '1BR', '2BR', '3BR', 'Loft', 'Penthouse'];
const PRICE_RANGES = [
  { label: 'Any Price', max: Infinity },
  { label: 'Under $2,000', max: 2000 },
  { label: '$2,000–$4,000', min: 2000, max: 4000 },
  { label: '$4,000–$7,000', min: 4000, max: 7000 },
  { label: '$7,000+', min: 7000, max: Infinity },
];
const CITIES = ['All Cities', 'San Francisco', 'New York', 'Brooklyn', 'Chicago', 'Miami', 'Los Angeles'];

export default function ListingsPage() {
  const { properties } = useProperty();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [city, setCity] = useState('All Cities');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const activeProperties = properties.filter(p => p.status === 'active');

  const filtered = activeProperties.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());

    const matchType = activeType === 'All' || (() => {
      if (activeType === 'Studio') return p.type === 'studio' || p.bedrooms === 0;
      if (activeType === '1BR') return p.bedrooms === 1;
      if (activeType === '2BR') return p.bedrooms === 2;
      if (activeType === '3BR') return p.bedrooms >= 3;
      if (activeType === 'Loft') return p.type === 'loft';
      if (activeType === 'Penthouse') return p.type === 'penthouse';
      return true;
    })();

    const matchPrice =
      p.price >= (priceRange.min ?? 0) &&
      p.price <= (priceRange.max ?? Infinity);

    const matchCity = city === 'All Cities' || p.city === city || p.state + ', ' + p.country === city;

    return matchSearch && matchType && matchPrice && matchCity;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.listedAt) - new Date(a.listedAt);
    return 0;
  });

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Search Header */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 20 }}>
            Find Your Next Home
          </h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ maxWidth: 560 }}>
              <Search size={17} color="var(--text-muted)" />
              <input
                id="listings-search"
                type="text"
                placeholder="Search by city, address, or property name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              className="form-input form-select"
              style={{ width: 'auto', flex: '0 0 auto' }}
              value={city}
              onChange={e => setCity(e.target.value)}
              id="city-filter"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <select
              className="form-input form-select"
              style={{ width: 'auto', flex: '0 0 auto' }}
              value={priceRange.label}
              onChange={e => setPriceRange(PRICE_RANGES.find(r => r.label === e.target.value))}
              id="price-filter"
            >
              {PRICE_RANGES.map(r => <option key={r.label}>{r.label}</option>)}
            </select>

            <select
              className="form-input form-select"
              style={{ width: 'auto', flex: '0 0 auto' }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              id="sort-filter"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="filter-chips" style={{ marginTop: 16, marginBottom: 0 }}>
            {TYPES.map(t => (
              <button
                key={t}
                id={`type-filter-${t.toLowerCase()}`}
                className={`chip ${activeType === t ? 'active' : ''}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container section-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MapPin size={36} />
            </div>
            <h2 className="empty-state-title">No Properties Found</h2>
            <p className="empty-state-desc">
              Try adjusting your filters or search term to find more listings.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { setSearch(''); setActiveType('All'); setPriceRange(PRICE_RANGES[0]); setCity('All Cities'); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
