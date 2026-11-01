import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { ToastProvider } from './context/ToastContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import KycPage from './pages/KycPage';
import DashboardPage from './pages/DashboardPage';
import ListPropertyPage from './pages/ListPropertyPage';
import LandlordsPage from './pages/LandlordsPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ReviewsPage from './pages/ReviewsPage';
import DisputesPage from './pages/DisputesPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdvisoryPage from './pages/AdvisoryPage';
import FaqPage from './pages/FaqPage';
import CareersPage from './pages/CareersPage';

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
          <SubscriptionProvider>
            <ToastProvider>
              <ScrollToTop />
              <Navbar />
              <Routes>
                {/* Public */}
                <Route path="/" element={<WithFooter><HomePage /></WithFooter>} />
                <Route path="/listings" element={<WithFooter><ListingsPage /></WithFooter>} />
                <Route path="/listings/:id" element={<WithFooter><PropertyDetailPage /></WithFooter>} />
                <Route path="/landlords" element={<WithFooter><LandlordsPage /></WithFooter>} />
                <Route path="/pricing" element={<WithFooter><PricingPage /></WithFooter>} />
                <Route path="/how-it-works" element={<WithFooter><HowItWorksPage /></WithFooter>} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Landlord flows */}
                <Route path="/kyc" element={<KycPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/properties" element={<DashboardPage />} />
                <Route path="/dashboard/properties/new" element={<ListPropertyPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Info & Legal */}
                <Route path="/about" element={<WithFooter><AboutPage /></WithFooter>} />
                <Route path="/advisory" element={<WithFooter><AdvisoryPage /></WithFooter>} />
                <Route path="/faq" element={<WithFooter><FaqPage /></WithFooter>} />
                <Route path="/blog" element={<Navigate to="/advisory" replace />} />
                <Route path="/careers" element={<WithFooter><CareersPage /></WithFooter>} />
                <Route path="/contact" element={<WithFooter><ContactPage /></WithFooter>} />
                <Route path="/privacy" element={<WithFooter><PrivacyPage /></WithFooter>} />
                <Route path="/terms" element={<WithFooter><TermsPage /></WithFooter>} />
                <Route path="/reviews" element={<WithFooter><ReviewsPage /></WithFooter>} />
                <Route path="/disputes" element={<WithFooter><DisputesPage /></WithFooter>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </SubscriptionProvider>
        </PropertyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
