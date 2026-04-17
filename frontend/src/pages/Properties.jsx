import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Users, Bed, Bath, ArrowRight, MapPin, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Fallback data με σωστές Airbnb φωτογραφίες
const FALLBACK_PROPERTIES = [
  {
    property_id: "feelings-4",
    name: { gr: "Feelings #4", en: "Feelings #4" },
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 4,
    price_per_night: 0,
    short_description: {
      gr: "Άνετη μεζονέτα με θέα στη θάλασσα και το βουνό, 5 λεπτά από την παραλία",
      en: "Cozy maisonette with sea and mountain views, 5 minutes from the beach"
    },
    photos: [
      "https://a0.muscache.com/im/pictures/adcf6013-4bca-4cff-9d76-a6510cf01a0c.jpg",
      "https://a0.muscache.com/im/pictures/48123589-4009-4707-8647-152974ed8707.jpg",
      "https://a0.muscache.com/im/pictures/1e10bbe8-0cdf-442b-ba93-7ff8cf0ea795.jpg"
    ],
    rating: 4.86,
    review_count: 50,
    featured: false
  },
  {
    property_id: "courtly-love",
    name: { gr: "Courtly Love", en: "Courtly Love" },
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 4,
    price_per_night: 0,
    short_description: {
      gr: "Άνετη μεζονέτα με θέα, 5 λεπτά από την παραλία",
      en: "Cozy maisonette with views, 5 minutes from the beach"
    },
    photos: [
      "https://a0.muscache.com/im/pictures/f7753e8d-bd2d-462b-a6ea-b92b7c1c8115.jpg",
      "https://a0.muscache.com/im/pictures/43b8f9a0-3f8e-41f0-a2d5-b84aa5866276.jpg",
      "https://a0.muscache.com/im/pictures/fda7e404-cc57-4f09-bf2a-2affd7877df8.jpg"
    ],
    rating: 4.9,
    review_count: 58,
    featured: true
  },
  {
    property_id: "the-journey",
    name: { gr: "Το Ταξίδι", en: "The Journey" },
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 4,
    price_per_night: 0,
    short_description: {
      gr: "Άνετο σπίτι με τζάκι και υπέροχη ανατολή ηλίου",
      en: "Cozy house with fireplace and beautiful sunrise"
    },
    photos: [
      "https://a0.muscache.com/im/pictures/86b4b999-09ff-4ecc-87fc-112504ade0c2.jpg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-27736860/original/44b4df68-029b-40dc-b377-da2572b0ca24.jpeg",
      "https://a0.muscache.com/im/pictures/ce43832d-ebf3-4805-aa61-ab80808e320c.jpg"
    ],
    rating: 4.95,
    review_count: 102,
    featured: true
  },
  {
    property_id: "feelings-houses",
    name: { gr: "Feelings Houses", en: "Feelings Houses" },
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 5,
    price_per_night: 0,
    short_description: {
      gr: "Ευρύχωρη μεζονέτα με 2 υπνοδωμάτια και θέα",
      en: "Spacious maisonette with 2 bedrooms and views"
    },
    photos: [
      "https://a0.muscache.com/im/pictures/8b2c981c-af77-4d03-8239-f67198c0fdfb.jpg",
      "https://a0.muscache.com/im/pictures/c52abe46-098d-4cdf-b6d2-027dcc3b5606.jpg",
      "https://a0.muscache.com/im/pictures/318808c7-311b-4e79-b9c6-2b1e7f48bb9f.jpg"
    ],
    rating: 4.92,
    review_count: 96,
    featured: true
  }
];

const Properties = () => {
  const { language } = useLanguage();
  const [properties, setProperties] = useState(FALLBACK_PROPERTIES);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/properties/?active_only=true`, { 
        timeout: 8000 // 8 second timeout
      });
      if (response.data && response.data.length > 0) {
        setProperties(response.data);
      }
    } catch (error) {
      console.log('Using fallback property data');
      // Already using FALLBACK_PROPERTIES as initial state
    } finally {
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
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-6 w-96 max-w-full bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-80 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex gap-4 pt-4">
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
