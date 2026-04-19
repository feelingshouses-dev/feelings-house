import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminCalendarSync from './pages/AdminCalendarSync';
import AdminProperties from './pages/AdminProperties';
import AdminPricingCalendar from './pages/AdminPricingCalendar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin/calendar-sync"
                element={
                  <ProtectedRoute>
                    <AdminCalendarSync />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/properties"
                element={
                  <ProtectedRoute>
                    <AdminProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pricing"
                element={
                  <ProtectedRoute>
                    <AdminPricingCalendar />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
