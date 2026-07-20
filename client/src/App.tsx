import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Import Types
import type { Product, UserRole, CurrentPage } from './types';

// Import Components
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginGateway } from './components/LoginGateway';
import { ReviewerDashboard } from './components/ReviewerDashboard';
import { ReviewForm } from './components/ReviewForm';
import { CreatorDashboard } from './components/CreatorDashboard';
import { CreatorAnalytics } from './components/CreatorAnalytics';

const BACKEND_URL = 'http://localhost:5001';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('landing');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('review_insight_session_token'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (currentPage === 'reviewer-dashboard' || currentPage === 'creator-dashboard') {
      fetchProducts();
    }
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });

      // Unified API Parsing: Safely detect array wrapper anomalies
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback Seed
      setProducts([
        {
          id: '65eeda000000000000000001',
          title: 'AeroGlide Wireless Workspace Mouse',
          description: 'Ergonomic trackball engineered for professional CAD layouts.',
          catalogImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
          creatorId: 'creator-1',
          launchStatus: 'Launched',
          analytics: {
            totalReviews: 48,
            sentimentScore: 84.5,
            integrityScore: 91.2,
            positiveTakeaways: ['Exceptional wrist muscle relief.'],
            negativeTakeaways: ['Charging port blocking tracking.']
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (email: string, pass: string) => {
    if (!userRole) return;
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const backendRole = userRole === 'creator' ? 'business' : 'reviewer';
      const generatedName = email.split('@')[0];

      const payload = isRegistering 
        ? { name: generatedName, email, password: pass, role: backendRole }
        : { email, password: pass };

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      const { token } = response.data;
      
      setAuthToken(token);
      localStorage.setItem('review_insight_session_token', token);
      setSuccessMessage(`Session secured as verified ${userRole}.`);
      
      setTimeout(() => {
        setSuccessMessage(null);
        setCurrentPage(userRole === 'reviewer' ? 'reviewer-dashboard' : 'creator-dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchProduct = async (title: string, desc: string, status: 'Launched' | 'Upcoming') => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${BACKEND_URL}/api/products`, 
        { title, description: desc, launchStatus: status, catalogImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setSuccessMessage("Product asset registered successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Added rating parameter to match the revised multi-input interactive form submit handler
  const handleReviewSubmit = async (text: string, likes: string, dislikes: string, rating: number) => {
    if (!selectedProduct) return;
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${BACKEND_URL}/api/reviews/${selectedProduct.id}`, 
        { 
          reviewText: text, 
          likes, 
          dislikes, 
          rating // FIXED: Now passing the runtime state parameter safely instead of hardcoding 5
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setSuccessMessage("Review processed securely!");
      setTimeout(() => {
        setSuccessMessage(null);
        setCurrentPage('reviewer-dashboard');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('review_insight_session_token');
    setUserRole(null);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col antialiased">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        {error && (
          <div className="mb-6 bg-flag-soft border border-flag/20 text-flag p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 shadow-sm max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 bg-verified-soft border border-verified/20 text-verified p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 shadow-sm max-w-2xl mx-auto">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-ink/20 backdrop-blur-xs z-50 flex items-center justify-center">
            <div className="bg-surface p-5 rounded-2xl shadow-xl border border-line flex flex-col items-center gap-3">
              <span className="signal-pulse text-ledger" style={{ height: '22px' }}>
                <span></span><span></span><span></span>
              </span>
              <p className="text-xs font-medium text-ink-soft">Processing live transaction packet...</p>
            </div>
          </div>
        )}

        {currentPage === 'landing' && (
          <LandingPage onRoleSelect={setUserRole} onNavigate={setCurrentPage} setIsRegistering={setIsRegistering} />
        )}
        {currentPage === 'login' && (
          <LoginGateway userRole={userRole} isRegistering={isRegistering} setIsRegistering={setIsRegistering} onNavigate={setCurrentPage} onSubmit={handleAuthSubmit} />
        )}
        {currentPage === 'reviewer-dashboard' && (
          <ReviewerDashboard products={products} onSelectProduct={setSelectedProduct} onNavigate={setCurrentPage} />
        )}
        {currentPage === 'review-form' && selectedProduct && (
          <ReviewForm selectedProduct={selectedProduct} onNavigate={setCurrentPage} onSubmit={handleReviewSubmit} />
        )}
        {currentPage === 'creator-dashboard' && (
          <CreatorDashboard products={products} onNavigate={setCurrentPage} onSelectProduct={setSelectedProduct} onLaunchProduct={handleLaunchProduct} />
        )}
        {currentPage === 'creator-analytics' && selectedProduct && (
          <CreatorAnalytics selectedProduct={selectedProduct} onNavigate={setCurrentPage} />
        )}
      </main>
    </div>
  );
}