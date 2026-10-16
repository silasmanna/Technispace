import { createContext, useContext, useState } from 'react';

const PropertyContext = createContext();

export const MOCK_PROPERTIES = [
  {
    id: 'prop-1',
    landlordId: 'landlord-1',
    landlordName: 'Marcus Johnson',
    landlordAvatar: 'MJ',
    landlordVerified: true,
    title: 'Modern Studio in Downtown Core',
    description: 'A stunning studio apartment with floor-to-ceiling windows and city views. Fully furnished with premium appliances, high-speed fiber internet, and weekly cleaning service included.',
    address: '142 Market Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 480,
    price: 2800,
    deposit: 5600,
    available: '2026-11-01',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Gym', 'Doorman', 'Rooftop', 'Laundry', 'Parking'],
    rating: 4.9,
    reviews: 24,
    status: 'active',
    listedAt: '2026-10-01',
    escrowStatus: 'clear',
    views: 342,
    inquiries: 8,
  },
  {
    id: 'prop-2',
    landlordId: 'landlord-1',
    landlordName: 'Marcus Johnson',
    landlordAvatar: 'MJ',
    landlordVerified: true,
    title: '2BR Luxury Condo with Skyline Views',
    description: 'Spacious 2-bedroom condo on the 22nd floor with breathtaking city skyline views. Open-plan kitchen, marble bathrooms, and access to building pool and gym.',
    address: '800 Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    type: '2br',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1150,
    price: 3900,
    deposit: 7800,
    available: '2026-11-15',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Concierge', 'Parking', 'Balcony'],
    rating: 4.7,
    reviews: 18,
    status: 'active',
    listedAt: '2026-09-20',
    escrowStatus: 'held',
    views: 518,
    inquiries: 14,
  },
  {
    id: 'prop-3',
    landlordId: 'landlord-2',
    landlordName: 'Priya Sharma',
    landlordAvatar: 'PS',
    landlordVerified: true,
    title: 'Cozy 1BR in Williamsburg',
    description: 'Charming one-bedroom apartment in the heart of Williamsburg. Exposed brick, hardwood floors, and a private backyard patio. Steps from the L train and best restaurants.',
    address: '37 Bedford Avenue',
    city: 'Brooklyn',
    state: 'NY',
    country: 'USA',
    type: '1br',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    price: 2600,
    deposit: 5200,
    available: '2026-10-20',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Backyard', 'Laundry', 'Bike Storage', 'Pet-Friendly'],
    rating: 4.8,
    reviews: 31,
    status: 'active',
    listedAt: '2026-10-05',
    escrowStatus: 'clear',
    views: 423,
    inquiries: 11,
  },
  {
    id: 'prop-4',
    landlordId: 'landlord-3',
    landlordName: 'James Okonkwo',
    landlordAvatar: 'JO',
    landlordVerified: true,
    title: 'Executive 3BR Penthouse',
    description: 'Premier penthouse spanning the entire top floor. Three bedrooms with en-suite baths, chef kitchen, private terrace with panoramic views, and smart home system.',
    address: '1 Park Lane',
    city: 'Miami',
    state: 'FL',
    country: 'USA',
    type: '3br',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    price: 9500,
    deposit: 19000,
    available: '2026-12-01',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Concierge', 'Private Terrace', 'Smart Home', 'Parking', 'Wine Cellar'],
    rating: 5.0,
    reviews: 9,
    status: 'active',
    listedAt: '2026-10-08',
    escrowStatus: 'clear',
    views: 892,
    inquiries: 27,
  },
  {
    id: 'prop-5',
    landlordId: 'landlord-3',
    landlordName: 'James Okonkwo',
    landlordAvatar: 'JO',
    landlordVerified: true,
    title: 'Minimalist Loft in Arts District',
    description: 'Industrial-chic loft with soaring 14-ft ceilings, polished concrete floors, and original factory windows. Open-plan living with a mezzanine sleeping area.',
    address: '560 Industrial Blvd',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    type: 'loft',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    price: 3200,
    deposit: 6400,
    available: '2026-11-01',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Rooftop', 'Gym', 'Parking', 'EV Charging'],
    rating: 4.6,
    reviews: 14,
    status: 'active',
    listedAt: '2026-09-28',
    escrowStatus: 'clear',
    views: 267,
    inquiries: 6,
  },
  {
    id: 'prop-6',
    landlordId: 'landlord-2',
    landlordName: 'Priya Sharma',
    landlordAvatar: 'PS',
    landlordVerified: true,
    title: 'Garden Apartment – Upper West Side',
    description: 'Serene ground-floor unit with direct access to a private garden. Two bedrooms, vintage details, and all utilities included. In a pre-war building with live-in super.',
    address: '224 West 80th Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    type: '2br',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    price: 4200,
    deposit: 8400,
    available: '2026-10-25',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
    ],
    amenities: ['Garden', 'Laundry', 'Storage', 'Pet-Friendly', 'Utilities Included'],
    rating: 4.7,
    reviews: 22,
    status: 'active',
    listedAt: '2026-10-02',
    escrowStatus: 'clear',
    views: 389,
    inquiries: 9,
  },
];

export const MOCK_ESCROW_TRANSACTIONS = [
  {
    id: 'escrow-1',
    propertyId: 'prop-2',
    propertyTitle: '2BR Luxury Condo with Skyline Views',
    tenantId: 'tenant-1',
    tenantName: 'Sofia Chen',
    landlordId: 'landlord-1',
    landlordName: 'Marcus Johnson',
    amount: 3900,
    deposit: 7800,
    platformFee: 195, // 5% of rent
    landlordReceives: 3705,
    status: 'held', // 'pending' | 'held' | 'released' | 'disputed'
    createdAt: '2026-10-10',
    releaseDate: '2026-10-15',
    timeline: [
      { event: 'Tenant payment received', date: '2026-10-10', status: 'done' },
      { event: 'Funds held in escrow', date: '2026-10-10', status: 'done' },
      { event: 'Landlord confirmation period', date: '2026-10-10', status: 'active' },
      { event: 'Platform fee deducted (5%)', date: 'Pending', status: 'pending' },
      { event: 'Net amount released to landlord', date: 'Pending', status: 'pending' },
    ],
  },
];

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [escrowTxns, setEscrowTxns] = useState(MOCK_ESCROW_TRANSACTIONS);
  const [inquiries, setInquiries] = useState([
    {
      id: 'inq-1',
      propertyId: 'prop-1',
      propertyTitle: 'Modern Studio in Downtown Core',
      tenantId: 'tenant-1',
      tenantName: 'Sofia Chen',
      landlordId: 'landlord-1',
      message: "Hi Marcus! I'm very interested in this studio. Is it still available for November 1st?",
      status: 'pending',
      sentAt: '2026-10-14',
    },
  ]);

  const addProperty = (data, landlordId, landlordName, landlordAvatar) => {
    const newProp = {
      id: `prop-${Date.now()}`,
      landlordId,
      landlordName,
      landlordAvatar,
      landlordVerified: true,
      ...data,
      rating: 0,
      reviews: 0,
      status: 'active',
      listedAt: new Date().toISOString().split('T')[0],
      escrowStatus: 'clear',
      views: 0,
      inquiries: 0,
      images: data.images || [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      ],
    };
    setProperties(prev => [newProp, ...prev]);
    return newProp;
  };

  const updateProperty = (id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const sendInquiry = (propertyId, propertyTitle, tenantId, tenantName, landlordId, message) => {
    const newInq = {
      id: `inq-${Date.now()}`,
      propertyId,
      propertyTitle,
      tenantId,
      tenantName,
      landlordId,
      message,
      status: 'pending',
      sentAt: new Date().toISOString().split('T')[0],
    };
    setInquiries(prev => [newInq, ...prev]);
    return newInq;
  };

  const initiateEscrow = (propertyId, tenantId, tenantName, landlordId, landlordName, amount, deposit) => {
    const fee = Math.round(amount * 0.05);
    const newEscrow = {
      id: `escrow-${Date.now()}`,
      propertyId,
      propertyTitle: properties.find(p => p.id === propertyId)?.title || '',
      tenantId,
      tenantName,
      landlordId,
      landlordName,
      amount,
      deposit,
      platformFee: fee,
      landlordReceives: amount - fee,
      status: 'held',
      createdAt: new Date().toISOString().split('T')[0],
      releaseDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      timeline: [
        { event: 'Tenant payment received', date: new Date().toISOString().split('T')[0], status: 'done' },
        { event: 'Funds held in escrow', date: new Date().toISOString().split('T')[0], status: 'done' },
        { event: 'Landlord confirmation period', date: new Date().toISOString().split('T')[0], status: 'active' },
        { event: 'Platform fee deducted (5%)', date: 'Pending', status: 'pending' },
        { event: 'Net amount released to landlord', date: 'Pending', status: 'pending' },
      ],
    };
    setEscrowTxns(prev => [newEscrow, ...prev]);
    updateProperty(propertyId, { escrowStatus: 'held' });
    return newEscrow;
  };

  const releaseEscrow = (escrowId) => {
    setEscrowTxns(prev => prev.map(e => {
      if (e.id !== escrowId) return e;
      return {
        ...e,
        status: 'released',
        timeline: e.timeline.map((t, i) => ({
          ...t,
          status: 'done',
          date: i >= 3 ? new Date().toISOString().split('T')[0] : t.date,
        })),
      };
    }));
  };

  return (
    <PropertyContext.Provider value={{
      properties, addProperty, updateProperty, deleteProperty,
      inquiries, sendInquiry,
      escrowTxns, initiateEscrow, releaseEscrow,
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperty = () => useContext(PropertyContext);
