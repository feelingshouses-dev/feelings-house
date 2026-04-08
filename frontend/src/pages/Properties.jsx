import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { properties } from '../utils/mockData';
import { Users, Bed, Bath, ArrowRight, MapPin } from 'lucide-react';

const Properties = () => {
  const [filter, setFilter] = useState('all');

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.bedrooms === parseInt(filter));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Τα Σπίτια μας</h1>
          <p className="text-xl text-gray-600">Επιλέξτε το ιδανικό σπίτι για τη διαμονή σας</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Όλα τα Σπίτια
          </Button>
          <Button
            variant={filter === '2' ? 'default' : 'outline'}
            onClick={() => setFilter('2')}
            className={filter === '2' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            2 Υπνοδωμάτια
          </Button>
          <Button
            variant={filter === '3' ? 'default' : 'outline'}
            onClick={() => setFilter('3')}
            className={filter === '3' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            3 Υπνοδωμάτια
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-3xl font-bold text-white mb-2">{property.name}</h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin size={16} className="mr-1" />
                    <span>Φηρά, Σαντορίνη</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                  €{property.price}/νύχτα
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6 text-base leading-relaxed">{property.description}</p>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Users className="text-blue-600" size={24} />
                    </div>
                    <div className="text-sm text-gray-600">Έως</div>
                    <div className="font-bold text-gray-900">{property.maxGuests} άτομα</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Bed className="text-blue-600" size={24} />
                    </div>
                    <div className="text-sm text-gray-600">Υπνοδωμάτια</div>
                    <div className="font-bold text-gray-900">{property.bedrooms}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Bath className="text-blue-600" size={24} />
                    </div>
                    <div className="text-sm text-gray-600">Μπάνια</div>
                    <div className="font-bold text-gray-900">{property.bathrooms}</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Παροχές:</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to={`/booking?property=${property.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base">
                    Κάντε Κράτηση
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
