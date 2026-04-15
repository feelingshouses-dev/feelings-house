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
              Πολυτελή ενοικιαζόμενα σπίτια στον Άγιο Γεώργιο, Περίβολος, Σαντορίνη με απεριόριστη θέα.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/Feelings-Houses-Santorini/61575050077775/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/feelings_houses_santorini/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
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
                <span>Άγιος Γεώργιος, Περίβολος<br />847 03 Σαντορίνη</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <Phone size={16} className="flex-shrink-0" />
                <a href="tel:+306976125764">+30 697 612 5764</a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/306976125764" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:feelingshouses@gmail.com">info@feelingshouses.gr</a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:feelingshouses@gmail.com">bookings@feelingshouses.gr</a>
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
