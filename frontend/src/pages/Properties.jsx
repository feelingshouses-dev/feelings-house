import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Users, Bed, Bath, ArrowRight, MapPin, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Properties = () => {
  const { language } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/properties/?active_only=true`);
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.bedrooms === parseInt(filter));

  const translations = {
    el: {
      title: 'Τα Σπίτια μας',
      subtitle: 'Επιλέξτε το ιδανικό σπίτι για τη διαμονή σας',
      allProperties: 'Όλα τα Σπίτια',
      bedrooms: 'Υπνοδωμάτια',
      guests: 'Επισκέπτες',
      bathrooms: 'Μπάνια',
      beds: 'Κρεβάτια',
      viewDetails: 'Δείτε Λεπτομέρειες',
      bookNow: 'Κράτηση Τώρα',
      perNight: '€/βράδυ',
      priceOnRequest: 'Τιμή κατόπιν αιτήματος',
      location: 'Περιβόλος, Σαντορίνη',
      reviews: 'κριτικές'
    },
    en: {
      title: 'Our Houses',
      subtitle: 'Choose the perfect house for your stay',
      allProperties: 'All Houses',
      bedrooms: 'Bedrooms',
      guests: 'Guests',
      bathrooms: 'Bathrooms',
      beds: 'Beds',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      perNight: '€/night',
      priceOnRequest: 'Price on request',
      location: 'Perivolos, Santorini',
      reviews: 'reviews'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {t.allProperties}
          </Button>
          <Button
            variant={filter === '1' ? 'default' : 'outline'}
            onClick={() => setFilter('1')}
            className={filter === '1' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            1 {t.bedrooms}
          </Button>
          <Button
            variant={filter === '2' ? 'default' : 'outline'}
            onClick={() => setFilter('2')}
            className={filter === '2' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            2 {t.bedrooms}
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredProperties.map((property) => (
            <Card key={property.property_id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-80 overflow-hidden group">
                <img
                  src={property.photos[0]}
                  alt={property.name[language]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {property.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                {property.rating > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{property.rating}</span>
                    <span className="text-gray-600 text-sm">({property.review_count} {t.reviews})</span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.name[language]}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{t.location}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {property.short_description[language]}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                      <div className="text-xs text-gray-500">{t.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                      <div className="text-xs text-gray-500">{t.bathrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{property.max_guests}</div>
                      <div className="text-xs text-gray-500">{t.guests}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {property.price_per_night > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-blue-600">€{property.price_per_night}</span>
                        <span className="text-gray-600 ml-1">{t.perNight}</span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-600">{t.priceOnRequest}</span>
                    )}
                  </div>
                  <Link to="/booking">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      {t.bookNow}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
