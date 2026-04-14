import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="Feelings Houses Santorini" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600">
              Πολυτελή ενοικιαζόμενα σπίτια στο Εμπορείο Σαντορίνης με απεριόριστη θέα.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Γρήγοροι Σύνδεσμοι</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Αρχική
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Σπίτια
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Γκαλερί
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Επικοινωνία</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Άγιος Γεώργιος, Εμπορείο<br />847 03 Σαντορίνη</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone size={16} className="flex-shrink-0" />
                <span>+30 697 612 5764</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@feelingshouses.gr</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Ενημέρωση</h4>
            <p className="text-sm text-gray-600 mb-4">
              Εγγραφείτε για προσφορές και νέα
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email σας"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-lg hover:bg-blue-700 transition-colors">
                Εγγραφή
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Feelings Houses Santorini. Με επιφύλαξη παντός δικαιώματος.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
