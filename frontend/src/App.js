import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminCalendarSync from './pages/AdminCalendarSync';
import AdminProperties from './pages/AdminProperties';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/calendar-sync" element={<AdminCalendarSync />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
          </Routes>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
