import { createContext, useContext, useState } from 'react';
import { saveProperty as fsSave, updateProperty as fsUpdate, deletePropertyDoc as fsDelete } from '../lib/firestore';

const PropertyContext = createContext();

// ─── Nigerian Mock Properties (prices in Naira ₦) ──────────────────────────
export const MOCK_PROPERTIES = [
  {
    id: 'prop-1',
    landlordId: 'landlord-1',
    landlordName: 'Emeka Johnson',
    landlordAvatar: 'EJ',
    landlordVerified: true,
    title: 'Modern Self-Con in Lekki Phase 1',
    description: 'A beautifully finished self-contained apartment with floor-to-ceiling tiles, prepaid meter, and 24/7 security. Located in a serene estate close to Lekki Phase 1 roundabout. Fully tiled with wardrobe spaces, kitchen cabinet and constant water supply.',
    address: '14B Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    country: 'Nigeria',
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    toilets: 1,
    sizeValue: '35',
    sizeUnit: 'sqm',
    price: 600_000,
    deposit: 600_000,
    available: '2026-11-01',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    ],
    amenities: ['WiFi', 'Generator', 'Security', 'Prepaid Meter', 'Running Water', 'Wardrobe'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'borehole',
    hotWater: 'no',
    parking: 'yes',
    parkingType: 'open',
    parkingSpaces: 1,
    landlordOnPremises: 'no',
    rating: 4.8,
    reviews: 12,
    status: 'active',
    listedAt: '2026-10-01',
    views: 342,
    inquiries: 8,
  },
  {
    id: 'prop-2',
    landlordId: 'landlord-1',
    landlordName: 'Emeka Johnson',
    landlordAvatar: 'EJ',
    landlordVerified: true,
    title: '3 Bedroom Flat in Ikeja GRA',
    description: 'Spacious 3-bedroom flat in the prestigious Ikeja GRA. Freshly painted, fully tiled, fitted kitchen with gas cooker point. 24/7 security, BQ available, parking for 2 cars. Walking distance to NNPC filling station and MMA2.',
    address: '22 Obafemi Awolowo Way',
    city: 'Ikeja',
    state: 'Lagos',
    country: 'Nigeria',
    type: '3br',
    bedrooms: 3,
    bathrooms: 2,
    toilets: 3,
    sizeValue: '180',
    sizeUnit: 'sqm',
    price: 2_800_000,
    deposit: 2_800_000,
    available: '2026-11-15',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
    ],
    amenities: ['Generator', 'Security', 'BQ', 'Parking', 'Fitted Kitchen', 'Water Tank'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'borehole',
    hotWater: 'no',
    parking: 'yes',
    parkingType: 'covered',
    parkingSpaces: 2,
    landlordOnPremises: 'no',
    rating: 4.7,
    reviews: 18,
    status: 'active',
    listedAt: '2026-09-20',
    views: 518,
    inquiries: 14,
  },
  {
    id: 'prop-3',
    landlordId: 'landlord-2',
    landlordName: 'Aisha Ibrahim',
    landlordAvatar: 'AI',
    landlordVerified: true,
    title: '2 Bedroom Apartment in Wuse 2',
    description: 'Tastefully finished 2-bedroom apartment in the heart of Wuse 2, Abuja. Pop ceiling, air conditioning units, fitted wardrobes, and tiled throughout. Ideal for small families or working professionals. Constant AEDC power supply in this area.',
    address: '7 Aminu Kano Crescent',
    city: 'Wuse 2',
    state: 'Abuja',
    country: 'Nigeria',
    type: '2br',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sizeValue: '120',
    sizeUnit: 'sqm',
    price: 1_800_000,
    deposit: 1_800_000,
    available: '2026-10-20',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    ],
    amenities: ['Air Conditioning', 'Generator', 'Security', 'Fitted Wardrobe', 'Pop Ceiling'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'borehole',
    hotWater: 'yes',
    parking: 'yes',
    parkingType: 'open',
    parkingSpaces: 1,
    landlordOnPremises: 'yes_compound',
    rating: 4.9,
    reviews: 31,
    status: 'active',
    listedAt: '2026-10-05',
    views: 423,
    inquiries: 11,
  },
  {
    id: 'prop-4',
    landlordId: 'landlord-3',
    landlordName: 'Chukwuemeka Obi',
    landlordAvatar: 'CO',
    landlordVerified: true,
    title: '4 Bedroom Duplex in Maitama',
    description: 'Grand 4-bedroom fully detached duplex in Maitama District, Abuja. Features a large living room, executive kitchen, swimming pool, ample parking for 4 cars, and a spacious servant quarter. High-end finishing with Italian tiles throughout.',
    address: '5 Panama Street',
    city: 'Maitama',
    state: 'Abuja',
    country: 'Nigeria',
    type: '4br',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeValue: '450',
    sizeUnit: 'sqm',
    price: 8_500_000,
    deposit: 8_500_000,
    available: '2026-12-01',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop',
    ],
    amenities: ['Swimming Pool', 'Generator', 'Security', 'BQ', 'Parking', 'Air Conditioning', 'Italian Tiles', 'Garden'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'borehole',
    hotWater: 'yes',
    parking: 'yes',
    parkingType: 'covered',
    parkingSpaces: 4,
    landlordOnPremises: 'no',
    rating: 5.0,
    reviews: 9,
    status: 'active',
    listedAt: '2026-10-08',
    views: 892,
    inquiries: 27,
  },
  {
    id: 'prop-5',
    landlordId: 'landlord-3',
    landlordName: 'Chukwuemeka Obi',
    landlordAvatar: 'CO',
    landlordVerified: true,
    title: 'Mini Flat in Trans-Amadi, Port Harcourt',
    description: 'Cosy mini flat with a large living room, bedroom and kitchen in the booming Trans-Amadi industrial area of Port Harcourt. Tiled throughout, functional kitchen cabinet, direct borehole water supply. Very quiet neighbourhood.',
    address: '12 Forces Avenue',
    city: 'Trans-Amadi',
    state: 'Rivers',
    country: 'Nigeria',
    type: '1br',
    bedrooms: 1,
    bathrooms: 1,
    toilets: 1,
    sizeValue: '55',
    sizeUnit: 'sqm',
    price: 450_000,
    deposit: 450_000,
    available: '2026-11-01',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop',
    ],
    amenities: ['Generator', 'Security', 'Prepaid Meter', 'Running Water'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'borehole',
    hotWater: 'no',
    parking: 'yes',
    parkingType: 'open',
    parkingSpaces: 1,
    landlordOnPremises: 'yes_diff_floor',
    rating: 4.5,
    reviews: 7,
    status: 'active',
    listedAt: '2026-09-28',
    views: 267,
    inquiries: 6,
  },
  {
    id: 'prop-6',
    landlordId: 'landlord-2',
    landlordName: 'Aisha Ibrahim',
    landlordAvatar: 'AI',
    landlordVerified: true,
    title: '3 Bedroom Terrace in Jabi, Abuja',
    description: 'Exquisite 3-bedroom terrace duplex in the serene Jabi district. Features an American-style kitchen, large dining area, balcony with garden view, and NNPC zone power. Estate with 24/7 security, swimming pool access and gym.',
    address: '3 Turaki Ali Road',
    city: 'Jabi',
    state: 'Abuja',
    country: 'Nigeria',
    type: '3br',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sizeValue: '230',
    sizeUnit: 'sqm',
    price: 3_500_000,
    deposit: 3_500_000,
    available: '2026-10-25',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
    ],
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Generator', 'Garden', 'Air Conditioning', 'Fitted Kitchen'],
    runningWater: 'yes',
    waterLocation: 'inside',
    waterSource: 'both',
    hotWater: 'yes',
    parking: 'yes',
    parkingType: 'covered',
    parkingSpaces: 2,
    landlordOnPremises: 'no',
    rating: 4.7,
    reviews: 22,
    status: 'active',
    listedAt: '2026-10-02',
    views: 389,
    inquiries: 9,
  },
];

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [inquiries, setInquiries] = useState([
    {
      id: 'inq-1',
      propertyId: 'prop-1',
      propertyTitle: 'Modern Self-Con in Lekki Phase 1',
      tenantId: 'tenant-1',
      tenantName: 'Tunde Adeyemi',
      landlordId: 'landlord-1',
      message: "Hi! I'm very interested in this apartment. Is it still available from November? Can I schedule a viewing this week?",
      status: 'pending',
      sentAt: '2026-10-14',
    },
    {
      id: 'inq-2',
      propertyId: 'prop-3',
      propertyTitle: '2 Bedroom Apartment in Wuse 2',
      tenantId: 'tenant-1',
      tenantName: 'Tunde Adeyemi',
      landlordId: 'landlord-2',
      message: 'Good day! Is the apartment still available? Is the price negotiable for a 2-year lease?',
      status: 'replied',
      sentAt: '2026-10-12',
    },
  ]);

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const addProperty = async (data, landlordId, landlordName, landlordAvatar) => {
    const localId = `prop-${Date.now()}`;
    const newProp = {
      id: localId,
      landlordId,
      landlordName,
      landlordAvatar,
      landlordVerified: true,
      ...data,
      rating: 0,
      reviews: 0,
      status: 'active',
      listedAt: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0,
      images: data.images?.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      ],
    };
    // Persist to Firestore (no-op in demo mode)
    try {
      const fsId = await fsSave({ ...newProp });
      if (fsId) newProp.firestoreId = fsId;
    } catch (e) {
      console.warn('Firestore save failed:', e.message);
    }
    setProperties(prev => [newProp, ...prev]);
    return newProp;
  };

  const updateProperty = async (id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const prop = properties.find(p => p.id === id);
    if (prop?.firestoreId) {
      try { await fsUpdate(prop.firestoreId, updates); } catch (e) {}
    }
  };

  const deleteProperty = async (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    const prop = properties.find(p => p.id === id);
    if (prop?.firestoreId) {
      try { await fsDelete(prop.firestoreId); } catch (e) {}
    }
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

  return (
    <PropertyContext.Provider value={{
      properties, addProperty, updateProperty, deleteProperty,
      inquiries, sendInquiry,
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperty = () => useContext(PropertyContext);
