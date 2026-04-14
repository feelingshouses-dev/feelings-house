import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/properties', label: t('nav.properties') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Feelings Houses Santorini" 
              className="h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.path) ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              title={language === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            >
              <Globe size={18} />
              <span className="uppercase">{language === 'el' ? 'EN' : 'ΕΛ'}</span>
            </button>
            
            <Link to="/booking">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="flex flex-col space-y-4 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Globe size={18} />
                <span>{language === 'el' ? 'English' : 'Ελληνικά'}</span>
              </button>
              
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t('nav.bookNow')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
