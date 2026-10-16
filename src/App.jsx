import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import KycPage from './pages/KycPage';
import DashboardPage from './pages/DashboardPage';
import ListPropertyPage from './pages/ListPropertyPage';
import LandlordsPage from './pages/LandlordsPage';

// Minimal placeholder page for routes not yet built
function PlaceholderPage({ title }) {
  return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>This page is coming soon.</p>
      </div>
    </div>
  );
}

// Pages that should show the full footer layout
function WithFooter({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PropertyProvider>
          <ToastProvider>
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/" element={<WithFooter><HomePage /></WithFooter>} />
              <Route path="/listings" element={<WithFooter><ListingsPage /></WithFooter>} />
              <Route path="/listings/:id" element={<WithFooter><PropertyDetailPage /></WithFooter>} />
              <Route path="/landlords" element={<WithFooter><LandlordsPage /></WithFooter>} />
              <Route path="/how-it-works" element={<WithFooter><PlaceholderPage title="How It Works" /></WithFooter>} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<PlaceholderPage title="Reset Password" />} />

              {/* Landlord */}
              <Route path="/kyc" element={<KycPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/properties" element={<DashboardPage />} />
              <Route path="/dashboard/properties/new" element={<ListPropertyPage />} />
              <Route path="/dashboard/saved" element={<DashboardPage />} />
              <Route path="/dashboard/settings" element={<DashboardPage />} />

              {/* Misc */}
              <Route path="/pricing" element={<WithFooter><PlaceholderPage title="Pricing" /></WithFooter>} />
              <Route path="/about" element={<WithFooter><PlaceholderPage title="About Us" /></WithFooter>} />
              <Route path="/blog" element={<WithFooter><PlaceholderPage title="Blog" /></WithFooter>} />
              <Route path="/careers" element={<WithFooter><PlaceholderPage title="Careers" /></WithFooter>} />
              <Route path="/contact" element={<WithFooter><PlaceholderPage title="Contact" /></WithFooter>} />
              <Route path="/privacy" element={<WithFooter><PlaceholderPage title="Privacy Policy" /></WithFooter>} />
              <Route path="/terms" element={<WithFooter><PlaceholderPage title="Terms of Service" /></WithFooter>} />
              <Route path="/escrow" element={<WithFooter><PlaceholderPage title="Escrow System" /></WithFooter>} />
              <Route path="/reviews" element={<WithFooter><PlaceholderPage title="Verified Reviews" /></WithFooter>} />
              <Route path="/disputes" element={<WithFooter><PlaceholderPage title="Dispute Resolution" /></WithFooter>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </PropertyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
